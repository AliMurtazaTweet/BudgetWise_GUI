#include "FileHandler.h"
#include <fstream>
#include <iostream>

bool FileHandler::saveToFile(const std::string& filename, const json& data) {
    try {
        std::ofstream file(filename);
        if (file.is_open()) {
            file << data.dump(4); // Pretty print with 4 spaces
            file.close();
            return true;
        }
    } catch (const std::exception& e) {
        std::cerr << "Error saving to file: " << e.what() << std::endl;
    }
    return false;
}

json FileHandler::loadFromFile(const std::string& filename) {
    try {
        std::ifstream file(filename);
        if (file.is_open()) {
            json data;
            file >> data;
            file.close();
            return data;
        }
    } catch (const std::exception& e) {
        // If file doesn't exist or is empty, return an empty array or object as appropriate
        // For simplicity, we'll return an empty json object
    }
    return json::array(); // Default to empty array for our collections
}
