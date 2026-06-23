#include "Analytics.h"
#include <algorithm>

double Analytics::calculateTotalIncome(const std::vector<Transaction>& transactions) {
    double total = 0.0;
    for (const auto& t : transactions) {
        if (t.getType() == "Income") {
            total += t.getAmount();
        }
    }
    return total;
}

double Analytics::calculateTotalExpense(const std::vector<Transaction>& transactions) {
    double total = 0.0;
    for (const auto& t : transactions) {
        if (t.getType() == "Expense") {
            total += t.getAmount();
        }
    }
    return total;
}

double Analytics::calculateSavings(const std::vector<Transaction>& transactions) {
    return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
}

std::string Analytics::getTopSpendingCategory(const std::vector<Transaction>& transactions) {
    auto breakdown = getCategoryBreakdown(transactions);
    if (breakdown.empty()) return "None";

    std::string topCategory = "";
    double maxSpent = -1.0;

    for (const auto& entry : breakdown) {
        if (entry.second > maxSpent) {
            maxSpent = entry.second;
            topCategory = entry.first;
        }
    }

    return topCategory;
}

std::map<std::string, double> Analytics::getCategoryBreakdown(const std::vector<Transaction>& transactions) {
    std::map<std::string, double> breakdown;
    for (const auto& t : transactions) {
        if (t.getType() == "Expense") {
            breakdown[t.getCategory()] += t.getAmount();
        }
    }
    return breakdown;
}
