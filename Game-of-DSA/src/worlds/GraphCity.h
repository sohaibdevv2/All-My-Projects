#pragma once
#include "World.h"
#include <vector>
#include <queue>
#include <stack>
#include <string>
#include <climits>
#include <functional>

struct GraphNode {
    int   id;
    float x, y;
    std::string label;
    Color color;
    bool  visited;
    bool  inQueue;
    float glow;
    float scale;
    int   dist;  // for Dijkstra/BFS
    int   parent;
};

struct GraphEdge {
    int from, to, weight;
    bool highlighted;
    bool inPath;
};

class GraphCityWorld : public World {
public:
    std::vector<GraphNode> nodes;
    std::vector<GraphEdge> edges;

    // Traversal state
    std::vector<int> visitOrder;
    int   visitStep  = 0;
    float visitTimer = 0.0f;
    bool  traversing = false;
    std::string algoName;

    // Path visualization
    std::vector<int> shortestPath;
    int startNode = 0, endNode = -1;

    // Drag state
    int  draggedNode = -1;
    int  selectedNode = -1;

    // Mode
    enum class Mode { VIEW, ADD_EDGE, TRAVERSE } mode = Mode::VIEW;
    int addEdgeFrom = -1;

    void Init(GameContext&) override {
        worldName  = "GRAPH CITY";
        themeColor = DSAColors::GRAPH_COLOR;
        score = 0; ops = 0;

        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // Build a sample city graph
        nodes = {
            { 0, sw*0.25f, sh*0.35f, "A", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 1, sw*0.45f, sh*0.25f, "B", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 2, sw*0.65f, sh*0.35f, "C", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 3, sw*0.30f, sh*0.55f, "D", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 4, sw*0.50f, sh*0.50f, "E", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 5, sw*0.70f, sh*0.55f, "F", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 6, sw*0.35f, sh*0.70f, "G", themeColor, false, false, 0, 1, INT_MAX, -1 },
            { 7, sw*0.60f, sh*0.70f, "H", themeColor, false, false, 0, 1, INT_MAX, -1 },
        };
        edges = {
            { 0, 1, 4, false, false }, { 0, 3, 2, false, false },
            { 1, 2, 3, false, false }, { 1, 4, 5, false, false },
            { 2, 5, 1, false, false }, { 3, 4, 6, false, false },
            { 3, 6, 3, false, false }, { 4, 5, 4, false, false },
            { 4, 7, 2, false, false }, { 5, 7, 3, false, false },
            { 6, 7, 5, false, false },
        };
    }

    void Update(GameContext& ctx, float dt) override {
        anim += dt;
        particles.Update(dt);
        notifications.Update(dt);

        for (auto& n : nodes) {
            n.glow  = fmaxf(0.0f, n.glow - dt * 2.0f);
            n.scale += (1.0f - n.scale) * 5.0f * dt;
        }

        // Traversal animation
        if (traversing) {
            visitTimer -= dt;
            if (visitTimer <= 0) {
                visitTimer = 0.5f;
                if (visitStep < (int)visitOrder.size()) {
                    int ni = visitOrder[visitStep];
                    nodes[ni].visited = true;
                    nodes[ni].glow    = 1.0f;
                    nodes[ni].color   = DSAColors::NEON_GREEN;
                    particles.Emit({ nodes[ni].x, nodes[ni].y }, DSAColors::NEON_GOLD, 10, 80, 0.6f, 4.0f);
                    visitStep++;
                } else {
                    traversing = false;
                    notifications.Push(algoName + " traversal complete! Visited " +
                                       std::to_string(visitOrder.size()) + " nodes", DSAColors::NEON_GREEN);
                    GainScore(80.0f);
                }
            }
        }

        // Drag node
        Vector2 mouse = GetMousePosition();
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            for (int i = 0; i < (int)nodes.size(); i++) {
                float d = Vector2Distance(mouse, { nodes[i].x, nodes[i].y });
                if (d < 22) {
                    if (mode == Mode::ADD_EDGE) {
                        if (addEdgeFrom == -1) {
                            addEdgeFrom = i;
                            notifications.Push("Select second node for edge", DSAColors::NEON_CYAN);
                        } else if (addEdgeFrom != i) {
                            edges.push_back({ addEdgeFrom, i, 1 + rand() % 9, false, false });
                            addEdgeFrom = -1;
                            notifications.Push("Edge added!", DSAColors::NEON_GREEN);
                        }
                    } else {
                        selectedNode = i;
                        draggedNode  = i;
                        nodes[i].glow = 1.0f;
                    }
                    break;
                }
            }
        }
        if (IsMouseButtonReleased(MOUSE_LEFT_BUTTON)) draggedNode = -1;
        if (draggedNode != -1) {
            nodes[draggedNode].x = mouse.x;
            nodes[draggedNode].y = mouse.y;
        }

        if (IsKeyPressed(KEY_ESCAPE) && !traversing) ctx.currentScreen = Screen::WORLD_SELECT;
    }

    void Draw(GameContext& ctx, Font font) override {
        float sw = (float)GetScreenWidth(), sh = (float)GetScreenHeight();

        // City night background
        for (int y = 0; y < (int)sh; y += 2) {
            float t = (float)y / sh;
            Color c = ColorLerp({ 8, 8, 15, 255 }, { 5, 5, 10, 255 }, t);
            DrawLine(0, y, (int)sw, y, c);
        }
        DrawCityBackground(sw, sh);
        DrawHUD(font, ctx, sw, sh);
        DrawBackButton(font, ctx);

        DrawEdges(font);
        DrawNodes(font);
        DrawControls(font, sw, sh);
        DrawInfoPanel(font, sw, sh);
        DrawComplexityInfo(font, "O(V+E)", "O(V)", sw - 220, 60);

        // Legend
        DrawTextEx(font, "Drag nodes  |  Click nodes to select  |  Add Edge mode: click two nodes",
                   { 20, sh - 175 }, 11, 1, DSAColors::TEXT_DIM);

        particles.Draw();
        notifications.Draw(font, sw);
        DrawScanlines({ 0, 0, sw, sh }, 0.015f);
    }

    void Cleanup() override { particles.Clear(); }
    Screen GetID() const override { return Screen::WORLD_GRAPH_CITY; }

private:
    void DoBFS() {
        Reset();
        algoName = "BFS";
        std::queue<int> q;
        std::vector<bool> vis(nodes.size(), false);
        q.push(0); vis[0] = true; nodes[0].inQueue = true;
        while (!q.empty()) {
            int cur = q.front(); q.pop();
            visitOrder.push_back(cur);
            for (auto& e : edges) {
                int nb = -1;
                if (e.from == cur && !vis[e.to])   nb = e.to;
                if (e.to   == cur && !vis[e.from])  nb = e.from;
                if (nb != -1) { vis[nb] = true; nodes[nb].inQueue = true; q.push(nb); }
            }
        }
        traversing = true; visitStep = 0; visitTimer = 0.3f;
        notifications.Push("BFS started from node A", themeColor);
    }

    void DoDFS() {
        Reset();
        algoName = "DFS";
        std::stack<int> stk;
        std::vector<bool> vis(nodes.size(), false);
        stk.push(0);
        while (!stk.empty()) {
            int cur = stk.top(); stk.pop();
            if (vis[cur]) continue;
            vis[cur] = true;
            visitOrder.push_back(cur);
            for (auto& e : edges) {
                int nb = -1;
                if (e.from == cur && !vis[e.to])  nb = e.to;
                if (e.to   == cur && !vis[e.from]) nb = e.from;
                if (nb != -1) stk.push(nb);
            }
        }
        traversing = true; visitStep = 0; visitTimer = 0.3f;
        notifications.Push("DFS started from node A", themeColor);
    }

    void DoDijkstra() {
        Reset();
        algoName = "DIJKSTRA";
        int n = nodes.size();
        std::vector<int> dist(n, INT_MAX);
        std::vector<bool> visited(n, false);
        dist[0] = 0;
        nodes[0].dist = 0;

        using pii = std::pair<int,int>;
        std::priority_queue<pii, std::vector<pii>, std::greater<pii>> pq;
        pq.push({ 0, 0 });

        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (visited[u]) continue;
            visited[u] = true;
            visitOrder.push_back(u);
            for (auto& e : edges) {
                int v = -1, w = e.weight;
                if (e.from == u) v = e.to;
                if (e.to   == u) v = e.from;
                if (v != -1 && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    nodes[v].dist = dist[v];
                    nodes[v].parent = u;
                    pq.push({ dist[v], v });
                }
            }
        }
        traversing = true; visitStep = 0; visitTimer = 0.4f;
        notifications.Push("Dijkstra's shortest paths from A", DSAColors::NEON_GOLD);

        // Highlight shortest path to last node
        if (n > 0) {
            shortestPath.clear();
            int cur = n - 1;
            while (cur != -1) { shortestPath.push_back(cur); cur = nodes[cur].parent; }
            std::reverse(shortestPath.begin(), shortestPath.end());
            for (auto& e : edges) e.inPath = false;
            for (int i = 0; i + 1 < (int)shortestPath.size(); i++) {
                for (auto& e : edges) {
                    if ((e.from == shortestPath[i] && e.to == shortestPath[i+1]) ||
                        (e.to   == shortestPath[i] && e.from == shortestPath[i+1]))
                        e.inPath = true;
                }
            }
        }
    }

    void Reset() {
        visitOrder.clear(); visitStep = 0;
        shortestPath.clear();
        for (auto& n : nodes) { n.visited = false; n.inQueue = false; n.color = themeColor; n.dist = INT_MAX; n.parent = -1; }
        for (auto& e : edges) { e.highlighted = false; e.inPath = false; }
    }

    void DrawCityBackground(float sw, float sh) {
        // Buildings
        for (int b = 0; b < 25; b++) {
            float bx = b * sw/25;
            float bh = 60 + sinf(b * 2.1f) * 40;
            DrawRectangle((int)bx, (int)(sh - 60 - bh), (int)(sw/28), (int)bh,
                          ColorAlpha({ 15, 20, 35, 255 }, 0.6f));
            // Windows
            for (int wy = 0; wy < 4; wy++)
                DrawRectangle((int)bx + 3, (int)(sh - 52 - bh + wy * 14), 6, 8,
                              ColorAlpha(DSAColors::NEON_GOLD, sinf(anim + b + wy) > 0.3f ? 0.3f : 0.05f));
        }
        // Ground
        DrawLineEx({ 0, sh - 60 }, { sw, sh - 60 }, 2, ColorAlpha(DSAColors::GRAPH_COLOR, 0.15f));
    }

    void DrawEdges(Font font) {
        for (auto& e : edges) {
            auto& a = nodes[e.from];
            auto& b = nodes[e.to];
            Color col = e.inPath     ? DSAColors::NEON_GOLD
                      : e.highlighted ? DSAColors::NEON_CYAN
                      : ColorAlpha(themeColor, 0.35f);
            float thick = e.inPath ? 3.0f : 1.5f;
            DrawLineEx({ a.x, a.y }, { b.x, b.y }, thick, col);

            // Weight label at midpoint
            float mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            std::string wStr = std::to_string(e.weight);
            DrawTextEx(GetFontDefault(), wStr.c_str(), { mx - 6, my - 8 }, 11, 1,
                       ColorAlpha(DSAColors::NEON_GOLD, 0.6f));
        }
    }

    void DrawNodes(Font font) {
        for (auto& n : nodes) {
            float r = 22.0f * n.scale;

            if (n.glow > 0.01f)
                DrawCircle((int)n.x, (int)n.y, (int)(r + 10), ColorAlpha(n.color, n.glow * 0.3f));

            // Node circle
            Color fill = n.visited  ? ColorAlpha(DSAColors::NEON_GREEN, 0.4f)
                       : n.inQueue  ? ColorAlpha(DSAColors::NEON_CYAN, 0.3f)
                       : ColorAlpha(DSAColors::BG_PANEL_SOLID, 0.9f);
            DrawCircle((int)n.x, (int)n.y, (int)r, fill);

            bool isSelected = (selectedNode == n.id);
            DrawCircleLines((int)n.x, (int)n.y, r,
                            isSelected ? DSAColors::NEON_GOLD : n.color);
            if (isSelected)
                DrawCircleLines((int)n.x, (int)n.y, r + 3, ColorAlpha(DSAColors::NEON_GOLD, 0.4f));

            // Label
            Vector2 lSz = MeasureTextEx(font, n.label.c_str(), 16, 1);
            DrawTextEx(font, n.label.c_str(), { n.x - lSz.x/2, n.y - lSz.y/2 }, 16, 1, n.color);

            // Distance label (Dijkstra)
            if (n.dist != INT_MAX) {
                std::string d = "d=" + std::to_string(n.dist);
                DrawTextEx(font, d.c_str(), { n.x + r + 4, n.y - 8 }, 10, 1,
                           ColorAlpha(DSAColors::NEON_GOLD, 0.8f));
            }
        }
    }

    void DrawControls(Font font, float sw, float sh) {
        float py = sh - 155;
        GlassPanel panel({ 20, py, sw - 40, 135 }, "GRAPH ALGORITHMS", themeColor);
        panel.Draw(font);

        float bw = 145, bh = 42, gap = 14;
        float totalBW = 5 * (bw + gap) - gap;
        float bx = sw/2 - totalBW/2;
        float by = py + 44;

        struct Op { std::string lbl; Color col; std::string hint; };
        std::vector<Op> ops2 = {
            { "BFS",        DSAColors::NEON_CYAN,   "Breadth-first" },
            { "DFS",        DSAColors::NEON_PURPLE,  "Depth-first" },
            { "DIJKSTRA",   DSAColors::NEON_GOLD,   "Shortest path" },
            { mode == Mode::ADD_EDGE ? "CANCEL EDGE" : "ADD EDGE", DSAColors::NEON_GREEN, "Add connection" },
            { "RESET",      DSAColors::TEXT_DIM,    "Clear state" },
        };

        for (int i = 0; i < (int)ops2.size(); i++) {
            CyberButton btn({ bx + i*(bw+gap), by, bw, bh }, ops2[i].lbl, ops2[i].col, 13);
            if (btn.Update(0.016f)) {
                if (ops2[i].lbl == "BFS")      DoBFS();
                else if (ops2[i].lbl == "DFS") DoDFS();
                else if (ops2[i].lbl == "DIJKSTRA") DoDijkstra();
                else if (ops2[i].lbl.find("EDGE") != std::string::npos) {
                    mode = (mode == Mode::ADD_EDGE) ? Mode::VIEW : Mode::ADD_EDGE;
                    addEdgeFrom = -1;
                    if (mode == Mode::ADD_EDGE)
                        notifications.Push("Click two nodes to add an edge", DSAColors::NEON_GREEN);
                }
                else if (ops2[i].lbl == "RESET") { traversing = false; Reset(); }
            }
            btn.Draw(font);

            Vector2 hSz = MeasureTextEx(font, ops2[i].hint.c_str(), 10, 1);
            DrawTextEx(font, ops2[i].hint.c_str(),
                       { bx + i*(bw+gap) + bw/2 - hSz.x/2, by + bh + 4 }, 10, 1,
                       ColorAlpha(ops2[i].col, 0.6f));
        }

        if (mode == Mode::ADD_EDGE) {
            std::string hint = addEdgeFrom == -1
                ? "Click first node..."
                : "Click second node (from " + nodes[addEdgeFrom].label + ")";
            DrawTextEx(font, hint.c_str(), { bx, by + bh + 28 }, 12, 1, DSAColors::NEON_GREEN);
        }
    }

    void DrawInfoPanel(Font font, float sw, float sh) {
        GlassPanel panel({ 20, 60, 210, 160 }, "GRAPH INFO", themeColor);
        panel.Draw(font);
        float fy = 104;
        auto row = [&](const char* k, const std::string& v, Color col) {
            DrawTextEx(font, k, { 32, fy }, 11, 1, DSAColors::TEXT_SECONDARY);
            DrawTextEx(font, v.c_str(), { 32, fy + 14 }, 14, 1, col);
            fy += 30;
        };
        row("NODES",    std::to_string(nodes.size()),                        DSAColors::NEON_CYAN);
        row("EDGES",    std::to_string(edges.size()),                        DSAColors::NEON_GREEN);
        row("ALGO",     algoName.empty() ? "NONE" : algoName,               themeColor);
        row("VISITED",  std::to_string(visitStep) + "/" + std::to_string(nodes.size()), DSAColors::NEON_GOLD);
    }
};
