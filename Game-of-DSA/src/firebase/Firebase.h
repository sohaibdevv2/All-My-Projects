#pragma once
#include <string>
#include <functional>
#include <map>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/fetch.h>
#else
#include <curl/curl.h>
#endif

#include "../external/json.hpp"
using json = nlohmann::json;

// Firebase REST API client
// Works on both desktop (libcurl) and web (emscripten_fetch)
class FirebaseClient {
public:
    // Replace these with your actual Firebase project details
    static constexpr const char* PROJECT_ID   = "game-of-dsa";
    static constexpr const char* API_KEY      = "YOUR_FIREBASE_API_KEY";
    static constexpr const char* AUTH_URL     = "https://identitytoolkit.googleapis.com/v1";
    static constexpr const char* FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/game-of-dsa/databases/(default)/documents";
    static constexpr const char* RTDB_URL     = "https://game-of-dsa-default-rtdb.firebaseio.com";

    std::string idToken;
    std::string refreshToken;
    std::string localId;
    bool        authenticated = false;

    using Callback = std::function<void(bool success, const json& data)>;

    FirebaseClient() {
#ifndef __EMSCRIPTEN__
        curl_global_init(CURL_GLOBAL_DEFAULT);
#endif
    }

    ~FirebaseClient() {
#ifndef __EMSCRIPTEN__
        curl_global_cleanup();
#endif
    }

    // Sign up with email and password
    void SignUp(const std::string& email, const std::string& password,
                const std::string& displayName, Callback cb) {
        json body = {
            {"email", email},
            {"password", password},
            {"returnSecureToken", true}
        };
        std::string url = std::string(AUTH_URL) + "/accounts:signUp?key=" + API_KEY;
        PostJSON(url, body.dump(), [this, displayName, cb](bool ok, const json& resp) {
            if (ok) {
                idToken      = resp.value("idToken", "");
                refreshToken = resp.value("refreshToken", "");
                localId      = resp.value("localId", "");
                authenticated = true;
                // Update display name
                UpdateProfile(displayName, [cb, resp](bool, const json&) {
                    cb(true, resp);
                });
            } else {
                cb(false, resp);
            }
        });
    }

    // Sign in with email and password
    void SignIn(const std::string& email, const std::string& password, Callback cb) {
        json body = {
            {"email", email},
            {"password", password},
            {"returnSecureToken", true}
        };
        std::string url = std::string(AUTH_URL) + "/accounts:signInWithPassword?key=" + API_KEY;
        PostJSON(url, body.dump(), [this, cb](bool ok, const json& resp) {
            if (ok) {
                idToken      = resp.value("idToken", "");
                refreshToken = resp.value("refreshToken", "");
                localId      = resp.value("localId", "");
                authenticated = true;
            }
            cb(ok, resp);
        });
    }

    void SignOut() {
        idToken.clear();
        refreshToken.clear();
        localId.clear();
        authenticated = false;
    }

    // Save player data to Firestore
    void SavePlayerData(const json& data, Callback cb) {
        if (!authenticated) { cb(false, {{"error", "Not authenticated"}}); return; }
        std::string url = std::string(FIRESTORE_URL) + "/players/" + localId +
                          "?updateMask.fieldPaths=xp&updateMask.fieldPaths=level&updateMask.fieldPaths=totalSolved";
        // Convert to Firestore document format
        json doc = ToFirestoreDoc(data);
        PatchJSON(url, doc.dump(), cb);
    }

    // Load player data from Firestore
    void LoadPlayerData(Callback cb) {
        if (!authenticated) { cb(false, {{"error", "Not authenticated"}}); return; }
        std::string url = std::string(FIRESTORE_URL) + "/players/" + localId;
        GetJSON(url, [cb](bool ok, const json& resp) {
            if (ok && resp.contains("fields")) {
                json data = FromFirestoreDoc(resp["fields"]);
                cb(true, data);
            } else {
                cb(false, resp);
            }
        });
    }

    // Leaderboard: get top 20
    void GetLeaderboard(Callback cb) {
        std::string url = std::string(RTDB_URL) + "/leaderboard.json?orderBy=\"xp\"&limitToLast=20";
        GetJSON(url, cb);
    }

    // Post score to leaderboard
    void PostScore(const std::string& username, int xp, int level, Callback cb) {
        if (!authenticated) { cb(false, {}); return; }
        json data = { {"username", username}, {"xp", xp}, {"level", level},
                      {"timestamp", 0} };  // server timestamp handled separately
        std::string url = std::string(RTDB_URL) + "/leaderboard/" + localId + ".json";
        PutJSON(url, data.dump(), cb);
    }

private:
    void UpdateProfile(const std::string& displayName, Callback cb) {
        json body = { {"idToken", idToken}, {"displayName", displayName}, {"returnSecureToken", false} };
        std::string url = std::string(AUTH_URL) + "/accounts:update?key=" + API_KEY;
        PostJSON(url, body.dump(), cb);
    }

    // Convert flat json to Firestore document fields format
    static json ToFirestoreDoc(const json& data) {
        json fields;
        for (auto& [key, val] : data.items()) {
            if (val.is_string())      fields[key] = { {"stringValue", val.get<std::string>()} };
            else if (val.is_number_integer()) fields[key] = { {"integerValue", std::to_string(val.get<int>())} };
            else if (val.is_number_float())   fields[key] = { {"doubleValue", val.get<double>()} };
            else if (val.is_boolean())        fields[key] = { {"booleanValue", val.get<bool>()} };
        }
        return { {"fields", fields} };
    }

    static json FromFirestoreDoc(const json& fields) {
        json result;
        for (auto& [key, val] : fields.items()) {
            if (val.contains("stringValue"))   result[key] = val["stringValue"].get<std::string>();
            else if (val.contains("integerValue")) result[key] = std::stoi(val["integerValue"].get<std::string>());
            else if (val.contains("doubleValue"))  result[key] = val["doubleValue"].get<double>();
            else if (val.contains("booleanValue")) result[key] = val["booleanValue"].get<bool>();
        }
        return result;
    }

#ifdef __EMSCRIPTEN__
    // Emscripten fetch-based HTTP
    struct FetchState {
        Callback cb;
        std::string body;
        std::string method;
    };

    static void OnSuccess(emscripten_fetch_t* fetch) {
        auto* state = (FetchState*)fetch->userData;
        try {
            json resp = json::parse(std::string(fetch->data, fetch->numBytes));
            bool ok = (fetch->status >= 200 && fetch->status < 300);
            state->cb(ok, resp);
        } catch (...) {
            state->cb(false, {{"error", "JSON parse error"}});
        }
        delete state;
        emscripten_fetch_close(fetch);
    }

    static void OnError(emscripten_fetch_t* fetch) {
        auto* state = (FetchState*)fetch->userData;
        state->cb(false, {{"error", "Network error"}});
        delete state;
        emscripten_fetch_close(fetch);
    }

    void DoFetch(const std::string& url, const std::string& method,
                 const std::string& body, Callback cb) {
        auto* state = new FetchState{ cb, body, method };
        emscripten_fetch_attr_t attr;
        emscripten_fetch_attr_init(&attr);
        strcpy(attr.requestMethod, method.c_str());
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
        attr.onsuccess  = OnSuccess;
        attr.onerror    = OnError;
        attr.userData   = state;

        static std::string bodyBuf; // keep alive during fetch
        static std::vector<const char*> hdrs;
        hdrs.clear();
        if (!body.empty()) {
            bodyBuf = body;
            attr.requestData     = bodyBuf.c_str();
            attr.requestDataSize = bodyBuf.size();
            static const char* contentHdrs[] = { "Content-Type", "application/json", nullptr };
            attr.requestHeaders = contentHdrs;
        }
        if (!idToken.empty()) {
            // Add auth header via JS shim
        }
        emscripten_fetch(&attr, url.c_str());
    }

    void GetJSON(const std::string& url, Callback cb) { DoFetch(url, "GET", "", cb); }
    void PostJSON(const std::string& url, const std::string& body, Callback cb) { DoFetch(url, "POST", body, cb); }
    void PutJSON(const std::string& url, const std::string& body, Callback cb) { DoFetch(url, "PUT", body, cb); }
    void PatchJSON(const std::string& url, const std::string& body, Callback cb) { DoFetch(url, "PATCH", body, cb); }

#else
    // Desktop: libcurl-based HTTP
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* s) {
        s->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    void DoRequest(const std::string& url, const std::string& method,
                   const std::string& body, Callback cb) {
        CURL* curl = curl_easy_init();
        if (!curl) { cb(false, {{"error", "curl init failed"}}); return; }

        std::string response;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 1L);

        struct curl_slist* hdrs = nullptr;
        hdrs = curl_slist_append(hdrs, "Content-Type: application/json");
        if (!idToken.empty()) {
            std::string auth = "Authorization: Bearer " + idToken;
            hdrs = curl_slist_append(hdrs, auth.c_str());
        }
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, hdrs);

        if (method == "POST") {
            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        } else if (method == "PUT") {
            curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        } else if (method == "PATCH") {
            curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PATCH");
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
        }

        CURLcode res = curl_easy_perform(curl);
        long httpCode = 0;
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);

        curl_slist_free_all(hdrs);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK) {
            cb(false, {{"error", curl_easy_strerror(res)}});
            return;
        }

        try {
            json resp = json::parse(response);
            cb(httpCode >= 200 && httpCode < 300, resp);
        } catch (...) {
            cb(false, {{"error", "JSON parse error"}, {"raw", response}});
        }
    }

    void GetJSON(const std::string& url, Callback cb)  { DoRequest(url, "GET", "", cb); }
    void PostJSON(const std::string& url, const std::string& b, Callback cb) { DoRequest(url, "POST", b, cb); }
    void PutJSON(const std::string& url, const std::string& b, Callback cb)  { DoRequest(url, "PUT", b, cb); }
    void PatchJSON(const std::string& url, const std::string& b, Callback cb){ DoRequest(url, "PATCH", b, cb); }
#endif
};
