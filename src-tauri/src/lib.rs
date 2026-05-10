use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn get_data_path(app: &tauri::AppHandle) -> PathBuf {
    // Store data in app's local data directory
    let data_dir = app.path().app_local_data_dir().expect("Failed to get app data dir");
    fs::create_dir_all(&data_dir).ok();
    data_dir.join("grade_data.json")
}

#[tauri::command]
fn save_data(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let path = get_data_path(&app);
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_data(app: tauri::AppHandle) -> Result<String, String> {
    let path = get_data_path(&app);
    if path.exists() {
        fs::read_to_string(&path).map_err(|e| e.to_string())
    } else {
        Ok(String::from("{}"))
    }
}

#[tauri::command]
fn get_data_location(app: tauri::AppHandle) -> String {
    get_data_path(&app).to_string_lossy().to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .invoke_handler(tauri::generate_handler![save_data, load_data, get_data_location])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
