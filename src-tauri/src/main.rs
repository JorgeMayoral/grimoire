#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use commands::{
    open_file::{open_md, open_ybf},
    save_file::{save_md, save_ybf},
};

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_md, save_md, open_ybf, save_ybf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
