#ifndef BUDGETMANAGER_H
#define BUDGETMANAGER_H

#include <vector>
#include <string>
#include "../core/Budget.h"

class BudgetManager {
private:
    std::vector<Budget> budgets;
    std::string dataFile;

    void loadBudgets();
    void saveBudgets();

public:
    BudgetManager(const std::string& filename = "data/budgets.json");
    
    void setBudget(int userId, const std::string& category, double limit);
    void updateSpentAmount(int userId, const std::string& category, double additionalSpent);
    Budget* getBudget(int userId, const std::string& category);
    std::vector<Budget> getBudgetsByUserId(int userId) const;
    bool deleteBudget(int userId, const std::string& category);
    void clearUserBudgets(int userId);
    
    const std::vector<Budget>& getAllBudgets() const;
};

#endif // BUDGETMANAGER_H
