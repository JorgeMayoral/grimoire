use std::fs;

#[tauri::command]
pub fn open_md(filename: String) -> String {
    fs::read_to_string(filename).unwrap_or("Something went wrong reading the file".to_string())
}

#[tauri::command]
pub fn open_ybf(filename: String, password: String) -> String {
    let file = ybf::read_file(filename.into(), Some(&password))
        .expect("Something went wrong reading the file");
    let content = file.decrypt_data(&password);
    String::from_utf8(content.to_owned())
        .expect("Something went wrong converting the file to a string")
}
