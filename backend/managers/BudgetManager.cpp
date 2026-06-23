#include "BudgetManager.h"
#include "../utils/FileHandler.h"
#include <algorithm>

BudgetManager::BudgetManager(const std::string& filename) : dataFile(filename) {
    loadBudgets();
}

void BudgetManager::loadBudgets() {
    json j = FileHandler::loadFromFile(dataFile);
    budgets.clear();
    for (const auto& item : j) {
        budgets.push_back(Budget::fromJson(item));
    }
}

void BudgetManager::saveBudgets() {
    json j = json::array();
    for (const auto& b : budgets) {
        j.push_back(b.toJson());
    }
    FileHandler::saveToFile(dataFile, j);
}

void BudgetManager::setBudget(int userId, const std::string& category, double limit) {
    for (auto& b : budgets) {
        if (b.getUserId() == userId && b.getCategory() == category) {
            b.setMonthlyLimit(limit);
            saveBudgets();
            return;
        }
    }
    
    Budget newBudget(userId, category, limit);
    budgets.push_back(newBudget);
    saveBudgets();
}

void BudgetManager::updateSpentAmount(int userId, const std::string& category, double additionalSpent) {
    for (auto& b : budgets) {
        if (b.getUserId() == userId && b.getCategory() == category) {
            b.addSpending(additionalSpent);
            saveBudgets();
            return;
        }
    }
}

Budget* BudgetManager::getBudget(int userId, const std::string& category) {
    for (auto& b : budgets) {
        if (b.getUserId() == userId && b.getCategory() == category) {
            return &b;
        }
    }
    return nullptr;
}

std::vector<Budget> BudgetManager::getBudgetsByUserId(int userId) const {
    std::vector<Budget> userBudgets;
    for (const auto& b : budgets) {
        if (b.getUserId() == userId) {
            userBudgets.push_back(b);
        }
    }
    return userBudgets;
}

bool BudgetManager::deleteBudget(int userId, const std::string& category) {
    for (auto it = budgets.begin(); it != budgets.end(); ++it) {
        if (it->getUserId() == userId && it->getCategory() == category) {
            budgets.erase(it);
            saveBudgets();
            return true;
        }
    }
    return false;
}

void BudgetManager::clearUserBudgets(int userId) {
    budgets.erase(
        std::remove_if(budgets.begin(), budgets.end(),
            [userId](const Budget& b) { return b.getUserId() == userId; }),
        budgets.end()
    );
    saveBudgets();
}

const std::vector<Budget>& BudgetManager::getAllBudgets() const {
    return budgets;
}
