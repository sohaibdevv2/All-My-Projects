cmake_minimum_required(VERSION 3.16)
project(GameOfDSA VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# ─── Sources ───────────────────────────────────────────────────────────────
set(SOURCES
    src/main.cpp
    src/core/Game.cpp
)

set(HEADERS
    src/core/Game.h
    src/core/GameState.h
    src/core/Colors.h
    src/ui/UIComponents.h
    src/ui/Particle.h
    src/firebase/Firebase.h
    src/screens/Screen.h
    src/screens/SplashScreen.h
    src/screens/MainMenu.h
    src/screens/WorldSelect.h
    src/screens/LoginScreen.h
    src/worlds/World.h
    src/worlds/ArrayForest.h
    src/worlds/StackVolcano.h
    src/worlds/QueueRailway.h
    src/worlds/TreeKingdom.h
    src/worlds/GraphCity.h
    src/worlds/SortingArena.h
    src/worlds/RecursionTemple.h
    src/worlds/HashArena.h
)

# ─── Include dirs ──────────────────────────────────────────────────────────
include_directories(
    ${CMAKE_SOURCE_DIR}/src
    ${CMAKE_SOURCE_DIR}/external
)

# ─── Platform detection ────────────────────────────────────────────────────
if(EMSCRIPTEN)
    # ── Web / Emscripten build ────────────────────────────────────────────
    message(STATUS "Building for Emscripten (WebAssembly)")

    add_executable(GameOfDSA ${SOURCES} ${HEADERS})

    # Raylib as a pre-built or source dependency
    set(RAYLIB_VERSION "5.0")
    find_package(raylib ${RAYLIB_VERSION} QUIET)

    if(NOT raylib_FOUND)
        include(FetchContent)
        FetchContent_Declare(
            raylib
            GIT_REPOSITORY https://github.com/raysan5/raylib.git
            GIT_TAG        5.0
        )
        set(BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
        set(BUILD_GAMES    OFF CACHE BOOL "" FORCE)
        FetchContent_MakeAvailable(raylib)
    endif()

    target_link_libraries(GameOfDSA raylib)

    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} \
        -s USE_GLFW=3 \
        -s ASYNCIFY \
        -s TOTAL_MEMORY=128MB \
        -s ALLOW_MEMORY_GROWTH=1 \
        -s EXPORTED_RUNTIME_METHODS=['ccall'] \
        -s FETCH=1 \
        -s WASM=1 \
        --shell-file ${CMAKE_SOURCE_DIR}/web/shell.html \
        --preload-file ${CMAKE_SOURCE_DIR}/assets@/assets \
        -O3"
    )

    set_target_properties(GameOfDSA PROPERTIES
        SUFFIX ".html"
        OUTPUT_NAME "index"
    )

    set(CMAKE_C_FLAGS   "${CMAKE_C_FLAGS}   -O3")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")

else()
    # ── Desktop build ─────────────────────────────────────────────────────
    message(STATUS "Building for Desktop (${CMAKE_SYSTEM_NAME})")

    add_executable(GameOfDSA ${SOURCES} ${HEADERS})

    # Raylib
    set(RAYLIB_VERSION "5.0")
    find_package(raylib ${RAYLIB_VERSION} QUIET)

    if(NOT raylib_FOUND)
        message(STATUS "Raylib not found — fetching from GitHub...")
        include(FetchContent)
        FetchContent_Declare(
            raylib
            GIT_REPOSITORY https://github.com/raysan5/raylib.git
            GIT_TAG        5.0
        )
        set(BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
        set(BUILD_GAMES    OFF CACHE BOOL "" FORCE)
        set(CMAKE_POLICY_VERSION_MINIMUM 3.5 CACHE STRING "" FORCE)
        FetchContent_MakeAvailable(raylib)
    endif()

    target_link_libraries(GameOfDSA raylib)

    # libcurl for Firebase REST API on desktop
    find_package(CURL QUIET)
    if(CURL_FOUND)
        target_link_libraries(GameOfDSA CURL::libcurl)
        target_compile_definitions(GameOfDSA PRIVATE DSA_HAS_CURL=1)
        message(STATUS "libcurl found — Firebase networking enabled")
    else()
        message(WARNING "libcurl not found — Firebase will be disabled on desktop")
    endif()

    # Platform-specific
    if(APPLE)
        target_link_libraries(GameOfDSA
            "-framework Cocoa"
            "-framework IOKit"
            "-framework CoreFoundation"
            "-framework OpenGL"
        )
    elseif(UNIX)
        target_link_libraries(GameOfDSA m pthread dl)
    elseif(WIN32)
        target_link_libraries(GameOfDSA winmm gdi32 opengl32)
    endif()

    # Copy assets next to executable
    add_custom_command(TARGET GameOfDSA POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_directory
            ${CMAKE_SOURCE_DIR}/assets
            $<TARGET_FILE_DIR:GameOfDSA>/assets
        COMMENT "Copying assets..."
    )

    # Install
    install(TARGETS GameOfDSA DESTINATION bin)
    install(DIRECTORY assets/ DESTINATION bin/assets)
endif()

# ─── Compiler warnings ─────────────────────────────────────────────────────
target_compile_options(GameOfDSA PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang>:    -Wall -Wextra -Wno-unused-parameter>
    $<$<CXX_COMPILER_ID:MSVC>:         /W3>
)

message(STATUS "")
message(STATUS "=================================")
message(STATUS "  GAME OF DSA — Build configured")
message(STATUS "  Target:  ${CMAKE_SYSTEM_NAME}")
message(STATUS "  C++ std: ${CMAKE_CXX_STANDARD}")
message(STATUS "=================================")
message(STATUS "")
