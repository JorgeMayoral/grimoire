#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use grimoire::{
    menu::{build_menu, handle_menu_event},
    state::EditorContent,
};

#[tauri::command]
fn sync_editor_content(state: tauri::State<EditorContent>, content: String) {
    *state.content.lock().unwrap() = content;
}

fn main() {
    tauri::Builder::default()
        .manage(EditorContent {
            content: Default::default(),
        })
        .menu(build_menu())
        .on_menu_event(handle_menu_event)
        .invoke_handler(tauri::generate_handler![sync_editor_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
