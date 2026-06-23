#include "UserManager.h"
#include "../utils/FileHandler.h"

UserManager::UserManager(const std::string& filename) : dataFile(filename), nextId(1) {
    loadUsers();
}

void UserManager::loadUsers() {
    json j = FileHandler::loadFromFile(dataFile);
    users.clear();
    for (const auto& item : j) {
        users.push_back(User::fromJson(item));
        if (users.back().getId() >= nextId) {
            nextId = users.back().getId() + 1;
        }
    }
}

void UserManager::saveUsers() {
    json j = json::array();
    for (const auto& user : users) {
        j.push_back(user.toJson());
    }
    FileHandler::saveToFile(dataFile, j);
}

bool UserManager::registerUser(const std::string& name, const std::string& email, const std::string& password) {
    // Check if user already exists
    for (const auto& user : users) {
        if (user.getEmail() == email) return false;
    }

    User newUser(nextId++, name, email, password);
    users.push_back(newUser);
    saveUsers();
    return true;
}

User* UserManager::loginUser(const std::string& email, const std::string& password) {
    for (auto& user : users) {
        if (user.getEmail() == email && user.getPassword() == password) {
            return &user;
        }
    }
    return nullptr;
}

User* UserManager::getUserById(int id) {
    for (auto& user : users) {
        if (user.getId() == id) return &user;
    }
    return nullptr;
}

bool UserManager::updateUserSettings(int id, const std::string& name, const std::string& email, const std::string& password, const std::string& preferences) {
    for (auto& user : users) {
        if (user.getId() == id) {
            user.setName(name);
            user.setEmail(email);
            if (!password.empty()) user.setPassword(password);
            user.setPreferences(preferences);
            saveUsers();
            return true;
        }
    }
    return false;
}

const std::vector<User>& UserManager::getAllUsers() const {
    return users;
}
