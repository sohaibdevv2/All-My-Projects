#pragma once
#include <string>
#include <vector>
#include <map>

enum class Screen {
    SPLASH,
    MAIN_MENU,
    LOGIN,
    REGISTER,
    WORLD_SELECT,
    PROFILE,
    LEADERBOARD,
    SETTINGS,

    // DSA Worlds
    WORLD_ARRAY_FOREST,
    WORLD_STACK_VOLCANO,
    WORLD_QUEUE_RAILWAY,
    WORLD_TREE_KINGDOM,
    WORLD_GRAPH_CITY,
    WORLD_SORTING_ARENA,
    WORLD_RECURSION_TEMPLE,
    WORLD_HASH_ARENA,
    WORLD_HEAP_MOUNTAIN,
    WORLD_DP_REALM,

    // Game modes
    PRACTICE_ARENA,
    DAILY_CHALLENGE,
    SURVIVAL_MODE,
    SPEEDRUN,
    SANDBOX,
    ALGO_VISUALIZER,

    EXIT
};

struct WorldProgress {
    bool unlocked    = false;
    int  level       = 0;
    int  starsEarned = 0;   // 0-3 stars
    int  bestTime    = 0;   // ms
    bool bossDefeated = false;
};

struct Achievement {
    std::string id;
    std::string name;
    std::string description;
    bool        earned = false;
    int         xpReward = 0;
};

struct PlayerData {
    std::string uid;
    std::string username;
    std::string email;
    int         xp           = 0;
    int         level        = 1;
    int         totalSolved  = 0;
    int         streak       = 0;
    int         coins        = 100;
    std::string avatarId     = "default";
    bool        isLoggedIn   = false;

    // World progress
    std::map<std::string, WorldProgress> worlds;
    std::vector<Achievement>             achievements;

    // Compute XP needed for next level
    int xpForNextLevel() const {
        return level * level * 100;
    }

    float xpProgress() const {
        int needed = xpForNextLevel();
        return needed > 0 ? (float)xp / needed : 0.0f;
    }

    // Add XP and handle leveling up
    bool addXP(int amount) {
        xp += amount;
        bool leveled = false;
        while (xp >= xpForNextLevel()) {
            xp -= xpForNextLevel();
            level++;
            leveled = true;
        }
        return leveled;
    }

    std::string rankName() const {
        if (level < 5)  return "Novice Coder";
        if (level < 10) return "Algorithm Apprentice";
        if (level < 15) return "Data Structure Knight";
        if (level < 20) return "Recursion Wizard";
        if (level < 30) return "Complexity Master";
        if (level < 40) return "Graph Conqueror";
        return "DSA Legend";
    }
};

struct GameSettings {
    float musicVolume  = 0.7f;
    float sfxVolume    = 0.8f;
    bool  fullscreen   = false;
    bool  showFPS      = false;
    bool  particles    = true;
    bool  animations   = true;
    int   targetFPS    = 60;
};

// Shared game context passed to all screens
struct GameContext {
    PlayerData   player;
    GameSettings settings;
    Screen       currentScreen = Screen::SPLASH;
    Screen       previousScreen = Screen::MAIN_MENU;
    bool         transitioning = false;
    float        transitionTimer = 0.0f;
    Screen       transitionTarget = Screen::MAIN_MENU;

    // World-specific context
    std::string  activeWorldId;
    int          activeLevel = 0;
};
