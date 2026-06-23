#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class Transaction {
private:
    int id;
    int userId;
    std::string type; // "Income" or "Expense"
    double amount;
    std::string category;
    std::string date;
    std::string merchant;

public:
    Transaction();
    Transaction(int id, int userId, std::string type, double amount, std::string category, std::string date, std::string merchant = "");

    // Getters
    int getId() const;
    int getUserId() const;
    std::string getType() const;
    double getAmount() const;
    std::string getCategory() const;
    std::string getDate() const;
    std::string getMerchant() const;

    // Setters
    void setId(int id);
    void setUserId(int userId);
    void setType(const std::string& type);
    void setAmount(double amount);
    void setCategory(const std::string& category);
    void setDate(const std::string& date);
    void setMerchant(const std::string& merchant);

    // JSON Conversion
    json toJson() const;
    static Transaction fromJson(const json& j);
};

#endif // TRANSACTION_H
