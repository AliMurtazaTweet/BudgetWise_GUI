#ifndef USER_H
#define USER_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class User {
private:
    int id;
    std::string name;
    std::string email;
    std::string password;
    std::string preferences; // JSON string for flexible preferences

public:
    User();
    User(int id, std::string name, std::string email, std::string password);

    // Getters
    int getId() const;
    std::string getName() const;
    std::string getEmail() const;
    std::string getPassword() const;

    // Setters
    void setId(int id);
    void setName(const std::string& name);
    void setEmail(const std::string& email);
    void setPassword(const std::string& password);
    void setPreferences(const std::string& preferences);

    // Getters
    std::string getPreferences() const;

    // JSON Conversion
    json toJson() const;
    static User fromJson(const json& j);
};

#endif // USER_H
