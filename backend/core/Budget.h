#ifndef BUDGET_H
#define BUDGET_H

#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class Budget {
private:
    int userId;
    std::string category;
    double monthlyLimit;
    double spentAmount;

public:
    Budget();
    Budget(int userId, std::string category, double monthlyLimit, double spentAmount = 0.0);

    // Getters
    int getUserId() const;
    std::string getCategory() const;
    double getMonthlyLimit() const;
    double getSpentAmount() const;

    // Setters
    void setUserId(int userId);
    void setCategory(const std::string& category);
    void setMonthlyLimit(double monthlyLimit);
    void setSpentAmount(double spentAmount);

    // Business Logic
    void addSpending(double amount);
    double getRemainingBudget() const;
    bool isExceeded() const;

    // JSON Conversion
    json toJson() const;
    static Budget fromJson(const json& j);
};

#endif // BUDGET_H
