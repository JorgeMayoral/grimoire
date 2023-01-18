use std::sync::Mutex;

pub struct EditorContent {
    pub content: Mutex<String>,
}
