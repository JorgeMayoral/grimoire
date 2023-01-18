#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, io::Write, sync::Mutex};
use tauri::Manager;

struct EditorContent {
    content: Mutex<String>,
}

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

fn build_menu() -> tauri::Menu {
    let save_item = tauri::CustomMenuItem::new("save_file", "Save File");
    let load_item = tauri::CustomMenuItem::new("load_file", "Load File");
    let file_submenu = tauri::Menu::with_items([save_item.into(), load_item.into()]);
    let menu = tauri::Menu::new().add_submenu(tauri::Submenu::new("File", file_submenu));
    menu
}

fn handle_menu_event(event: tauri::WindowMenuEvent) {
    match event.menu_item_id() {
        "load_file" => handle_load_file(event.window().to_owned()),
        "save_file" => handle_save_file(event.window().to_owned()),
        _ => {}
    }
}

fn handle_save_file(window: tauri::Window) {
    let state = window.state::<EditorContent>();
    let content = state.content.lock().unwrap().clone();
    tauri::api::dialog::FileDialogBuilder::new()
        .add_filter("Markdown File", &["md"])
        .add_filter("All Files", &["*"])
        .set_title("Save File")
        .save_file(move |file_path| {
            let path = match file_path {
                Some(p) => p,
                None => return,
            };
            let mut file = fs::File::create(path).expect("error creating file");
            file.write_all(content.as_bytes())
                .expect("error writing file");
        })
}

fn handle_load_file(window: tauri::Window) {
    tauri::api::dialog::FileDialogBuilder::new()
        .add_filter("Markdown File", &["md"])
        .add_filter("All Files", &["*"])
        .set_title("Load File")
        .pick_file(move |file_path| {
            let path = match file_path {
                Some(p) => p,
                None => return,
            };
            let content = fs::read_to_string(path).expect("error loading file");
            window.emit("load_file", content).unwrap();
        })
}
