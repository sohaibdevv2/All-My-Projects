#pragma once
#include "World.h"
#include <string>
#include <vector>
#include <queue>
#include <functional>

struct BSTNode {
    int   value;
    float x, y;         // visual position
    float targetX, targetY;
    float scale;
    float glow;
    Color color;
    int   left = -1, right = -1, parent = -1;
    bool  highlighted = false;
    bool  visited     = false;
};

class TreeKingdomWorld : public World {
public:
    std::vector<BSTNode> nodes;
    int root = -1;

    // Traversal state
    std::vector<int> traversalOrder;
    int traversalStep  = 0;
    float traversalTimer = 0.0f;
    bool  traversing   = false;
    std::string traversalName;

    std::string inputBuf;
    bool showInput = false;
    enum class InputMode { NONE, INSERT, SEARCH, DELETE } inputMode = InputMode::NONE;

    // Search path visualization
    std::vector<int> searchPath;
    bool searchFound = false;

    float treeAnim = 0.0f;

    void Init(GameContext&) override {
        worldName  = "TREE KINGDOM";
        themeColor = DSAColors::TREE_COLOR;
        nodes.clear();
        root = -1;
        traversalOrder.clear();
        traversing = false;
        searchPath.clear();
        score = 0; ops = 0;

        // Build initial BST
        for (int v : { 50, 30, 70, 20, 40, 60, 80, 10, 35 }) Insert(v, true);
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        treeAnim += dt;
        particles.Update(dt);
        notifications.Update(dt);

        // Animate node positions
        for (auto& n : nodes) {
            n.x += (n.targetX - n.x) * 6.0f * dt;
            n.y += (n.targetY - n.y) * 6.0f * dt;
            n.glow = fmaxf(0.0f, n.glow - dt * 1.5f);
            n.scale += (1.0f - n.scale) * 5.0f * dt;
        }

        // Auto-advance traversal
        if (traversing) {
            traversalTimer -= dt;
            if (traversalTimer <= 0) {
                traversalTimer = 0.4f;
                if (traversalStep < (int)traversalOrder.size()) {
                    int idx = traversalOrder[traversalStep];
                    if (idx >= 0 && idx < (int)nodes.size()) {
                        nodes[idx].visited     = true;
                        nodes[idx].highlighted = true;
                        nodes[idx].glow        = 1.0f;
                        particles.Emit({ nodes[idx].x, nodes[idx].y }, themeColor, 8, 60, 0.5f, 3.0f);
                    }
                    traversalStep++;
                } else {
                    traversing = false;
                    notifications.Push(traversalName + " traversal complete!", DSAColors::NEON_GREEN);
                    GainScore(60.0f);
                }
            }
        }

        // Input
        if (showInput) {
            int key = GetCharPressed();
            while (key > 0) {
                if (key >= '0' && key <= '9' && inputBuf.size() < 4) inputBuf += (char)key;
                key = GetCharPressed();
            }
            if (IsKeyPressed(KEY_BACKSPACE) && !inputBuf.empty()) inputBuf.pop_back();
            if (IsKeyPressed(KEY_ENTER)) { ConfirmInput(); showInput = false; }
            if (IsKeyPressed(KEY_ESCAPE)) { inputBuf.clear(); showInput = false; }
        }

        if (IsKeyPressed(KEY_ESCAPE) && !showInput) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Purple kingdom background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 10, 5, 25, 255 }, { 5, 3, 15, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }

        // Floating castle silhouette
        DrawCastleBackground(sw, sh);

        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        DrawTree(font, sw, sh);
        DrawControls(font, sw, sh);
        DrawInfoPanel(font, sw, sh);
        DrawComplexityInfo(font, "O(log n)", "O(n)", sw - 220, 60);

        // Traversal result strip
        if (!traversalOrder.empty()) DrawTraversalStrip(font, sw, sh);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_TREE_KINGDOM; }

private:
    int NewNode(int val) {
        BSTNode n;
        n.value   = val;
        n.x = n.targetX = (float)GetScreenWidth() / 2;
        n.y = n.targetY = 100.0f;
        n.scale   = 0.1f;
        n.glow    = 1.0f;
        n.color   = themeColor;
        n.left = n.right = n.parent = -1;
        nodes.push_back(n);
        return (int)nodes.size() - 1;
    }

    void Insert(int val, bool silent = false) {
        if (!silent && nodes.size() >= 20) {
            notifications.Push("Tree is full (max 20 nodes)!", DSAColors::NEON_RED);
            return;
        }

        if (root == -1) {
            root = NewNode(val);
        } else {
            int cur = root, par = -1;
            bool goLeft = false;
            while (cur != -1) {
                par = cur;
                if (val == nodes[cur].value) {
                    if (!silent) notifications.Push(std::to_string(val) + " already exists!", DSAColors::NEON_GOLD);
                    return;
                }
                goLeft = (val < nodes[cur].value);
                cur    = goLeft ? nodes[cur].left : nodes[cur].right;
            }
            int newIdx = NewNode(val);
            nodes[newIdx].parent = par;
            if (goLeft) nodes[par].left  = newIdx;
            else        nodes[par].right = newIdx;
        }

        RecomputeLayout();
        if (!silent) {
            notifications.Push("INSERT " + std::to_string(val) + " → BST", DSAColors::NEON_GREEN);
            GainScore(20.0f); ops++;
        }
    }

    void RecomputeLayout() {
        if (root == -1) return;
        float sw = (float)GetScreenWidth();
        AssignPositions(root, sw/2, 120, sw/2.5f);
    }

    void AssignPositions(int idx, float x, float y, float spread) {
        if (idx == -1) return;
        nodes[idx].targetX = x;
        nodes[idx].targetY = y;
        AssignPositions(nodes[idx].left,  x - spread, y + 70, spread / 1.8f);
        AssignPositions(nodes[idx].right, x + spread, y + 70, spread / 1.8f);
    }

    void SearchVal(int val) {
        searchPath.clear();
        searchFound = false;
        for (auto& n : nodes) n.highlighted = false;

        int cur = root;
        while (cur != -1) {
            searchPath.push_back(cur);
            nodes[cur].highlighted = true;
            if (val == nodes[cur].value) { searchFound = true; break; }
            cur = (val < nodes[cur].value) ? nodes[cur].left : nodes[cur].right;
        }

        if (searchFound)
            notifications.Push("FOUND " + std::to_string(val) + " in " +
                               std::to_string(searchPath.size()) + " steps!", DSAColors::NEON_GREEN);
        else
            notifications.Push(std::to_string(val) + " NOT FOUND", DSAColors::NEON_RED);
        GainScore(30.0f); ops++;
    }

    void StartTraversal(const std::string& type) {
        for (auto& n : nodes) { n.visited = false; n.highlighted = false; }
        traversalOrder.clear();
        traversalStep = 0;
        traversalTimer = 0.2f;
        traversalName = type;

        std::function<void(int)> inorder = [&](int idx) {
            if (idx == -1) return;
            inorder(nodes[idx].left);
            traversalOrder.push_back(idx);
            inorder(nodes[idx].right);
        };
        std::function<void(int)> preorder = [&](int idx) {
            if (idx == -1) return;
            traversalOrder.push_back(idx);
            preorder(nodes[idx].left);
            preorder(nodes[idx].right);
        };
        std::function<void(int)> postorder = [&](int idx) {
            if (idx == -1) return;
            postorder(nodes[idx].left);
            postorder(nodes[idx].right);
            traversalOrder.push_back(idx);
        };
        std::function<void()> levelorder = [&]() {
            std::queue<int> q;
            if (root != -1) q.push(root);
            while (!q.empty()) {
                int idx = q.front(); q.pop();
                traversalOrder.push_back(idx);
                if (nodes[idx].left  != -1) q.push(nodes[idx].left);
                if (nodes[idx].right != -1) q.push(nodes[idx].right);
            }
        };

        if (type == "INORDER")    inorder(root);
        else if (type == "PREORDER")  preorder(root);
        else if (type == "POSTORDER") postorder(root);
        else if (type == "LEVEL")     levelorder();

        traversing = true;
        notifications.Push(type + " traversal started...", DSAColors::NEON_CYAN);
    }

    void ConfirmInput() {
        if (inputBuf.empty()) return;
        int val = std::stoi(inputBuf);
        inputBuf.clear();
        if (inputMode == InputMode::INSERT) Insert(val);
        else if (inputMode == InputMode::SEARCH) SearchVal(val);
        inputMode = InputMode::NONE;
    }

    void DrawCastleBackground(float sw, float sh) {
        // Simple castle towers
        float baseY = sh - 80;
        Color castleCol = ColorAlpha({ 20, 10, 40, 255 }, 0.7f);
        for (int t = 0; t < 5; t++) {
            float tx = t * sw/5 + 40;
            float th = 100 + t * 20;
            DrawRectangle((int)tx, (int)(baseY - th), 60, (int)th, castleCol);
            // Battlements
            for (int b = 0; b < 3; b++)
                DrawRectangle((int)(tx + b*20), (int)(baseY - th - 15), 14, 15, castleCol);
            // Tower top
            DrawTriangle({ tx + 30, baseY - th - 40 },
                         { tx,      baseY - th - 15 },
                         { tx + 60, baseY - th - 15 },
                         ColorAlpha(themeColor, 0.15f));
        }

        // Stars / magic particles
        for (int s = 0; s < 30; s++) {
            float sx2 = fmodf(s * 83.3f + anim * 10, sw);
            float sy2 = 60 + fmodf(s * 57.1f + s * 30.0f, sh/2);
            DrawCircle((int)sx2, (int)sy2, 1, ColorAlpha(themeColor, sinf(anim + s) * 0.3f + 0.2f));
        }
    }

    void DrawTree(Font font, float sw, float sh) {
        if (root == -1) {
            DrawTextEx(font, "Empty tree. Click INSERT to add nodes.",
                       { sw/2 - 200, sh/2 }, 14, 1, DSAColors::TEXT_DIM);
            return;
        }

        // Draw edges
        for (int i = 0; i < (int)nodes.size(); i++) {
            if (nodes[i].left != -1) {
                int li = nodes[i].left;
                Color ec = nodes[i].highlighted && nodes[li].highlighted
                         ? ColorLerp(themeColor, DSAColors::NEON_GOLD, 0.5f)
                         : ColorAlpha(themeColor, 0.4f);
                DrawLineEx({ nodes[i].x, nodes[i].y }, { nodes[li].x, nodes[li].y }, 2, ec);
            }
            if (nodes[i].right != -1) {
                int ri = nodes[i].right;
                Color ec = nodes[i].highlighted && nodes[ri].highlighted
                         ? ColorLerp(themeColor, DSAColors::NEON_GOLD, 0.5f)
                         : ColorAlpha(themeColor, 0.4f);
                DrawLineEx({ nodes[i].x, nodes[i].y }, { nodes[ri].x, nodes[ri].y }, 2, ec);
            }
        }

        // Draw nodes
        for (int i = 0; i < (int)nodes.size(); i++) {
            auto& n = nodes[i];
            float r = 22.0f * n.scale;

            bool isSearchPath = false;
            for (int sp : searchPath) if (sp == i) { isSearchPath = true; break; }

            // Glow
            if (n.glow > 0.01f || n.highlighted)
                DrawCircle((int)n.x, (int)n.y, (int)(r + 8), ColorAlpha(n.color, (n.glow + (n.highlighted ? 0.4f : 0)) * 0.3f));

            // Node fill
            Color fill = n.visited     ? ColorAlpha(DSAColors::NEON_GREEN, 0.3f)
                       : n.highlighted ? ColorAlpha(DSAColors::NEON_GOLD, 0.3f)
                       : ColorAlpha(DSAColors::BG_PANEL_SOLID, 0.9f);
            DrawCircle((int)n.x, (int)n.y, (int)r, fill);
            DrawCircleLines((int)n.x, (int)n.y, r,
                            n.highlighted ? DSAColors::NEON_GOLD
                          : isSearchPath  ? DSAColors::NEON_CYAN
                          : ColorLerp(ColorAlpha(themeColor, 0.5f), themeColor, n.glow));

            // Value
            std::string vs = std::to_string(n.value);
            Vector2 vSz = MeasureTextEx(font, vs.c_str(), 14, 1);
            DrawTextEx(font, vs.c_str(),
                       { n.x - vSz.x/2, n.y - vSz.y/2 },
                       14, 1, n.highlighted ? DSAColors::NEON_GOLD : themeColor);

            // Root label
            if (i == root) {
                DrawTextEx(font, "ROOT", { n.x - 18, n.y - r - 18 }, 10, 1,
                           ColorAlpha(themeColor, 0.7f));
            }
        }
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 150;
        GlassPanel panel({ 20, py, sw - 40, 130 }, "BST OPERATIONS", themeColor);
        panel.Draw(font);

        float bw = 130, bh = 42, gap = 12;
        float totalBW = 6 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 42;

        struct Op { std::string lbl; Color col; };
        std::vector<Op> ops2 = {
            { "INSERT",   DSAColors::NEON_GREEN },
            { "SEARCH",   DSAColors::NEON_GOLD },
            { "INORDER",  DSAColors::NEON_CYAN },
            { "PREORDER", DSAColors::NEON_PURPLE },
            { "POSTORDER",DSAColors::NEON_PINK },
            { "LEVEL",    DSAColors::TREE_COLOR },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 13);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "INSERT") {
                    inputMode = InputMode::INSERT;
                    showInput = true; inputBuf.clear();
                } else if (ops2[i].lbl == "SEARCH") {
                    inputMode = InputMode::SEARCH;
                    showInput = true; inputBuf.clear();
                } else {
                    if (!traversing) StartTraversal(ops2[i].lbl);
                }
            }
            btn.Draw(font);
        }

        // Traversal progress
        if (traversing) {
            float pct = (float)traversalStep / fmaxf(1, traversalOrder.size());
            ProgressBar pb({ bx, by + bh + 10, totalBW, 10 }, themeColor, true, traversalName);
            pb.SetValue(pct); pb.displayValue = pct;
            pb.Draw(font);
        }

        if (showInput) {
            float ix = sw/2 - 150, iy = by - 70;
            DrawRectangle((int)ix - 10, (int)iy - 8, 320, 64, DSAColors::BG_PANEL_SOLID);
            DrawRectangleLinesEx({ ix-10, iy-8, 320, 64 }, 2, themeColor);
            DrawTextEx(font, inputMode == InputMode::INSERT ? "Value to INSERT:" : "Value to SEARCH:",
                       { ix, iy }, 13, 1, themeColor);
            Rectangle ir = { ix, iy + 20, 300, 32 };
            DrawRectangleRec(ir, DSAColors::BG_DARK);
            DrawRectangleLinesEx(ir, 2, themeColor);
            std::string disp = inputBuf + (fmod(GetTime(), 1.0) < 0.5 ? "|" : "");
            DrawTextEx(font, disp.c_str(), { ix + 8, iy + 28 }, 17, 1, DSAColors::TEXT_WHITE);
        }
    }

    void DrawInfoPanel(Font font, float sw, float) {
        GlassPanel panel({ 20, 60, 200, 160 }, "TREE INFO", themeColor);
        panel.Draw(font);
        float fy = 104;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { 32, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { 32, fy + 14 }, 14, 1, col);
            fy += 30;
        };
        row("NODES",    std::to_string(nodes.size()),        DSAColors::NEON_CYAN);
        row("HEIGHT",   std::to_string(TreeHeight(root)),    DSAColors::NEON_GREEN);
        row("BALANCED", IsBalanced(root) ? "YES" : "NO",    IsBalanced(root) ? DSAColors::NEON_GREEN : DSAColors::NEON_RED);
        row("SCORE",    std::to_string((int)score),          DSAColors::NEON_GOLD);
    }

    void DrawTraversalStrip(Font font, float sw, float sh) {
        float py = sh - 155;
        DrawTextEx(font, (traversalName + " order: ").c_str(), { sw - 360, py }, 11, 1, DSAColors::TEXT_SECONDARY);
        std::string strip;
        for (int i = 0; i < (int)traversalOrder.size(); i++) {
            if (traversalOrder[i] < (int)nodes.size()) {
                Color col = i < traversalStep ? DSAColors::NEON_GREEN : DSAColors::TEXT_DIM;
                std::string vs = std::to_string(nodes[traversalOrder[i]].value);
                DrawTextEx(font, vs.c_str(), { sw - 360 + 150 + i * 24.0f, py }, 12, 1, col);
            }
        }
    }

    int TreeHeight(int idx) {
        if (idx == -1) return 0;
        return 1 + std::max(TreeHeight(nodes[idx].left), TreeHeight(nodes[idx].right));
    }

    bool IsBalanced(int idx) {
        if (idx == -1) return true;
        int lh = TreeHeight(nodes[idx].left);
        int rh = TreeHeight(nodes[idx].right);
        return abs(lh - rh) <= 1 && IsBalanced(nodes[idx].left) && IsBalanced(nodes[idx].right);
    }
};
