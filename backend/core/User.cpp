#include "User.h"

User::User() : id(0), preferences("{}") {}

User::User(int id, std::string name, std::string email, std::string password)
    : id(id), name(name), email(email), password(password), preferences("{}") {}

int User::getId() const { return id; }
std::string User::getName() const { return name; }
std::string User::getEmail() const { return email; }
std::string User::getPassword() const { return password; }
std::string User::getPreferences() const { return preferences; }

void User::setId(int id) { this->id = id; }
void User::setName(const std::string& name) { this->name = name; }
void User::setEmail(const std::string& email) { this->email = email; }
void User::setPassword(const std::string& password) { this->password = password; }
void User::setPreferences(const std::string& preferences) { this->preferences = preferences; }

json User::toJson() const {
    return json{
        {"id", id},
        {"name", name},
        {"email", email},
        {"password", password},
        {"preferences", preferences}
    };
}

User User::fromJson(const json& j) {
    User u(
        j.at("id").get<int>(),
        j.at("name").get<std::string>(),
        j.at("email").get<std::string>(),
        j.at("password").get<std::string>()
    );
    if (j.contains("preferences")) {
        u.setPreferences(j.at("preferences").get<std::string>());
    }
    return u;
}
