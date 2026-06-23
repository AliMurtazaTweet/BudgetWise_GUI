#ifndef USERMANAGER_H
#define USERMANAGER_H

#include <vector>
#include <string>
#include "../core/User.h"

class UserManager {
private:
    std::vector<User> users;
    std::string dataFile;
    int nextId;

    void loadUsers();
    void saveUsers();

public:
    UserManager(const std::string& filename = "data/users.json");
    
    bool registerUser(const std::string& name, const std::string& email, const std::string& password);
    User* loginUser(const std::string& email, const std::string& password);
    User* getUserById(int id);
    bool updateUserSettings(int id, const std::string& name, const std::string& email, const std::string& password, const std::string& preferences);
    
    const std::vector<User>& getAllUsers() const;
};

#endif // USERMANAGER_H
