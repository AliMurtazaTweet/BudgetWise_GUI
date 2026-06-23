#ifndef FILEHANDLER_H
#define FILEHANDLER_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class FileHandler {
public:
    static bool saveToFile(const std::string& filename, const json& data);
    static json loadFromFile(const std::string& filename);
};

#endif // FILEHANDLER_H
