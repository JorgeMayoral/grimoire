use std::fs;

use ybf::Ybf;

#[tauri::command]
pub fn save_md(filename: String, content: String) {
    fs::write(filename, content).expect("Something went wrong writing the file");
}

#[tauri::command]
pub fn save_ybf(filename: String, content: String, password: String) {
    let content_bytes = content.as_bytes().to_vec();
    let encrypted = Ybf::create_protected(&password, content_bytes);
    ybf::write_file(&encrypted, filename.into()).expect("Something went wrong writing the file");
}
