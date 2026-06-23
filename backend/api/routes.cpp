#include <httplib.h>
#include <nlohmann/json.hpp>
#include "../managers/UserManager.h"
#include "../managers/TransactionManager.h"
#include "../managers/BudgetManager.h"
#include "../core/Analytics.h"

using json = nlohmann::json;

void setup_routes(httplib::Server& svr, UserManager& userMgr, TransactionManager& transMgr, BudgetManager& budgetMgr) {
    
    // CORS Middleware-like header setting for all responses
    svr.Post("/api/register", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            std::string name = body.at("name").get<std::string>();
            std::string email = body.at("email").get<std::string>();
            std::string password = body.at("password").get<std::string>();

            json response;
            if (userMgr.registerUser(name, email, password)) {
                response["status"] = "success";
                response["message"] = "User registered successfully";
            } else {
                response["status"] = "error";
                response["message"] = "User already exists";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/login", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            std::string email = body.at("email").get<std::string>();
            std::string password = body.at("password").get<std::string>();

            User* user = userMgr.loginUser(email, password);
            json response;
            if (user) {
                response["status"] = "success";
                response["user"] = user->toJson();
            } else {
                response["status"] = "error";
                response["message"] = "Invalid credentials";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/api/user", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("userId")) {
            int userId = std::stoi(req.get_param_value("userId"));
            User* user = userMgr.getUserById(userId);
            
            json response;
            if (user) {
                response["status"] = "success";
                response["user"] = user->toJson();
            } else {
                response["status"] = "error";
                response["message"] = "User not found";
            }
            res.set_content(response.dump(), "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"error\":\"userId parameter missing\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/transaction", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int userId = body.at("userId").get<int>();
            std::string type = body.at("type").get<std::string>();
            double amount = body.at("amount").get<double>();
            std::string category = body.at("category").get<std::string>();
            std::string date = body.at("date").get<std::string>();

            std::string merchant = body.contains("merchant") ? body.at("merchant").get<std::string>() : category;

            transMgr.addTransaction(userId, type, amount, category, date, merchant);
            
            // If it's an expense, update the budget spent amount
            if (type == "Expense") {
                budgetMgr.updateSpentAmount(userId, category, amount);
            }

            json response;
            response["status"] = "success";
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/api/transactions", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("userId")) {
            int userId = std::stoi(req.get_param_value("userId"));
            auto transactions = transMgr.getTransactionsByUserId(userId);
            
            json j_list = json::array();
            for (const auto& t : transactions) {
                j_list.push_back(t.toJson());
            }
            res.set_content(j_list.dump(), "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"error\":\"userId parameter missing\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/budget", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int userId = body.at("userId").get<int>();
            std::string category = body.at("category").get<std::string>();
            double limit = body.at("limit").get<double>();

            budgetMgr.setBudget(userId, category, limit);

            json response;
            response["status"] = "success";
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/budget/delete", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int userId = body.at("userId").get<int>();
            std::string category = body.at("category").get<std::string>();

            json response;
            if (budgetMgr.deleteBudget(userId, category)) {
                response["status"] = "success";
            } else {
                response["status"] = "error";
                response["message"] = "Budget not found";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/api/budgets", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("userId")) {
            int userId = std::stoi(req.get_param_value("userId"));
            auto budgets = budgetMgr.getBudgetsByUserId(userId);
            auto transactions = transMgr.getTransactionsByUserId(userId);
            
            json j_list = json::array();
            for (auto& b : budgets) {
                double spent = 0.0;
                for (const auto& t : transactions) {
                    if (t.getUserId() == userId && t.getType() == "Expense" && t.getCategory() == b.getCategory()) {
                        spent += t.getAmount();
                    }
                }
                b.setSpentAmount(spent);
                j_list.push_back(b.toJson());
            }
            res.set_content(j_list.dump(), "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"error\":\"userId parameter missing\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Get("/api/analytics", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("userId")) {
            int userId = std::stoi(req.get_param_value("userId"));
            auto transactions = transMgr.getTransactionsByUserId(userId);
            
            double income = Analytics::calculateTotalIncome(transactions);
            double expense = Analytics::calculateTotalExpense(transactions);
            double savings = income - expense;
            std::string topCat = Analytics::getTopSpendingCategory(transactions);
            auto breakdown = Analytics::getCategoryBreakdown(transactions);

            json response;
            response["income"] = income;
            response["expense"] = expense;
            response["savings"] = savings;
            response["topCategory"] = topCat;
            
            json j_breakdown = json::object();
            for (const auto& entry : breakdown) {
                j_breakdown[entry.first] = entry.second;
            }
            response["breakdown"] = j_breakdown;
            
            res.set_content(response.dump(), "application/json");
        } else {
            res.status = 400;
            res.set_content("{\"error\":\"userId parameter missing\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/transaction/delete", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int transactionId = body.at("transactionId").get<int>();

            json response;
            if (transMgr.deleteTransaction(transactionId)) {
                response["status"] = "success";
            } else {
                response["status"] = "error";
                response["message"] = "Transaction not found";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/transaction/update", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int transactionId = body.at("transactionId").get<int>();
            std::string type = body.at("type").get<std::string>();
            double amount = body.at("amount").get<double>();
            std::string category = body.at("category").get<std::string>();
            std::string date = body.at("date").get<std::string>();
            std::string merchant = body.at("merchant").get<std::string>();

            json response;
            if (transMgr.updateTransaction(transactionId, type, amount, category, date, merchant)) {
                response["status"] = "success";
            } else {
                response["status"] = "error";
                response["message"] = "Transaction not found";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    svr.Post("/api/user/update", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int userId = body.at("userId").get<int>();
            std::string name = body.at("name").get<std::string>();
            std::string email = body.at("email").get<std::string>();
            std::string password = body.contains("password") ? body.at("password").get<std::string>() : "";
            std::string preferences = body.at("preferences").get<std::string>();

            json response;
            if (userMgr.updateUserSettings(userId, name, email, password, preferences)) {
                response["status"] = "success";
                response["user"] = userMgr.getUserById(userId)->toJson();
            } else {
                response["status"] = "error";
                response["message"] = "User not found";
            }
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Invalid request body\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });
    
    svr.Post("/api/erase-data", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            auto body = json::parse(req.body);
            int userId = body.at("userId").get<int>();

            transMgr.clearUserTransactions(userId);
            budgetMgr.clearUserBudgets(userId);

            // Also reset user settings/preferences back to default
            User* user = userMgr.getUserById(userId);
            if (user) {
                userMgr.updateUserSettings(userId, user->getName(), user->getEmail(), "", "{}");
            }

            json response;
            response["status"] = "success";
            response["message"] = "All data erased successfully";
            res.set_content(response.dump(), "application/json");
        } catch (...) {
            res.status = 400;
            res.set_content("{\"status\":\"error\",\"message\":\"Failed to erase data\"}", "application/json");
        }
        res.set_header("Access-Control-Allow-Origin", "*");
    });

    // Handle OPTIONS for CORS preflight
    svr.Options(R"(/api/.*)", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
    });
}
