#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include "core/User.h"
#include "core/Transaction.h"
#include "core/Budget.h"
#include "core/Analytics.h"
#include "managers/UserManager.h"
#include "managers/TransactionManager.h"
#include "managers/BudgetManager.h"

using namespace std;

void printHeader(const string& title) {
    cout << "\n" << string(40, '=') << "\n";
    cout << "  " << title << "\n";
    cout << string(40, '=') << "\n";
}

int main() {
    printHeader("BudgetWise Backend Verification");

    // Initialize Managers
    UserManager userMgr("data/users.json");
    TransactionManager transMgr("data/transactions.json");
    BudgetManager budgetMgr("data/budgets.json");

    // 1. Register/Login a user
    cout << "[Step 1] Registering and Logging in User...\n";
    string email = "ali@example.com";
    if (userMgr.registerUser("Ali Murtaza", email, "password123")) {
        cout << "User registered successfully.\n";
    } else {
        cout << "User already exists (proceeding with existing).\n";
    }

    User* currentUser = userMgr.loginUser(email, "password123");
    if (currentUser) {
        cout << "Logged in as: " << currentUser->getName() << " (ID: " << currentUser->getId() << ")\n";
    } else {
        cerr << "Login failed!\n";
        return 1;
    }

    int uid = currentUser->getId();

    // 2. Add Transactions
    printHeader("Adding Transactions");
    cout << "Adding Income: $5000 (Salary)\n";
    transMgr.addTransaction(uid, "Income", 5000.0, "Salary", "2026-03-16", "Salary");

    cout << "Adding Expense: $1200 (Rent)\n";
    transMgr.addTransaction(uid, "Expense", 1200.0, "Housing", "2026-03-16", "Landlord");

    cout << "Adding Expense: $300 (Groceries)\n";
    transMgr.addTransaction(uid, "Expense", 300.0, "Food", "2026-03-16", "Groceries");

    cout << "Adding Expense: $150 (Internet)\n";
    transMgr.addTransaction(uid, "Expense", 150.0, "Bills", "2026-03-16", "ISP");

    // 3. Set Budget
    printHeader("Budget Management");
    cout << "Setting Food budget: $500\n";
    budgetMgr.setBudget(uid, "Food", 500.0);

    Budget* foodBudget = budgetMgr.getBudget(uid, "Food");
    if (foodBudget) {
        // Find food transactions and update spent
        double foodSpent = 0;
        auto userTrans = transMgr.getTransactionsByUserId(uid);
        for(const auto& t : userTrans) {
            if(t.getCategory() == "Food") foodSpent += t.getAmount();
        }
        foodBudget->setSpentAmount(foodSpent);

        cout << "Food Budget Status: " << foodBudget->getSpentAmount() << " / " << foodBudget->getMonthlyLimit() << "\n";
        cout << "Remaining: $" << foodBudget->getRemainingBudget() << "\n";
        if (foodBudget->isExceeded()) cout << "WARNING: Budget Exceeded!\n";
        else cout << "Status: Within Limit\n";
    }

    // 4. Analytics
    printHeader("Financial Analytics");
    auto userTrans = transMgr.getTransactionsByUserId(uid);
    double totalInc = Analytics::calculateTotalIncome(userTrans);
    double totalExp = Analytics::calculateTotalExpense(userTrans);
    double savings = Analytics::calculateSavings(userTrans);
    string topCat = Analytics::getTopSpendingCategory(userTrans);

    cout << left << setw(20) << "Total Income:" << "$" << totalInc << "\n";
    cout << left << setw(20) << "Total Expense:" << "$" << totalExp << "\n";
    cout << left << setw(20) << "Net Savings:" << "$" << savings << "\n";
    cout << left << setw(20) << "Top Spending Cat:" << topCat << "\n";

    cout << "\n[Verification Complete]\n";

    return 0;
}
