#include "Budget.h"

Budget::Budget() : userId(0), monthlyLimit(0.0), spentAmount(0.0) {}

Budget::Budget(int userId, std::string category, double monthlyLimit, double spentAmount)
    : userId(userId), category(category), monthlyLimit(monthlyLimit), spentAmount(spentAmount) {}

int Budget::getUserId() const { return userId; }
std::string Budget::getCategory() const { return category; }
double Budget::getMonthlyLimit() const { return monthlyLimit; }
double Budget::getSpentAmount() const { return spentAmount; }

void Budget::setUserId(int userId) { this->userId = userId; }
void Budget::setCategory(const std::string& category) { this->category = category; }
void Budget::setMonthlyLimit(double monthlyLimit) { this->monthlyLimit = monthlyLimit; }
void Budget::setSpentAmount(double spentAmount) { this->spentAmount = spentAmount; }

void Budget::addSpending(double amount) {
    this->spentAmount += amount;
}

double Budget::getRemainingBudget() const {
    return monthlyLimit - spentAmount;
}

bool Budget::isExceeded() const {
    return spentAmount > monthlyLimit;
}

json Budget::toJson() const {
    return json{
        {"userId", userId},
        {"category", category},
        {"monthlyLimit", monthlyLimit},
        {"spentAmount", spentAmount}
    };
}

Budget Budget::fromJson(const json& j) {
    return Budget(
        j.at("userId").get<int>(),
        j.at("category").get<std::string>(),
        j.at("monthlyLimit").get<double>(),
        j.at("spentAmount").get<double>()
    );
}
