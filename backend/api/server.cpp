#include <httplib.h>
#include <iostream>
#include <cstdlib>
#include <string>
#include "../managers/UserManager.h"
#include "../managers/TransactionManager.h"
#include "../managers/BudgetManager.h"

// Forward declaration of the routes setup function
void setup_routes(httplib::Server& svr, UserManager& userMgr, TransactionManager& transMgr, BudgetManager& budgetMgr);

int main() {
    // Initialize Managers
    UserManager userMgr("data/users.json");
    TransactionManager transMgr("data/transactions.json");
    BudgetManager budgetMgr("data/budgets.json");

    httplib::Server svr;

    // Setup API routes
    setup_routes(svr, userMgr, transMgr, budgetMgr);

    const char* env_p = std::getenv("PORT");
    int port = env_p ? std::stoi(env_p) : 8080;

    std::cout << "BudgetWise C++ Backend Server listening on http://0.0.0.0:" << port << std::endl;

    // Start listening on dynamic port or 8080
    if (!svr.listen("0.0.0.0", port)) {
        std::cerr << "Failed to start server on port " << port << std::endl;
        return 1;
    }

    return 0;
}
