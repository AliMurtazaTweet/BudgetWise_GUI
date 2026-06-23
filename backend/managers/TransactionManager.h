#ifndef TRANSACTIONMANAGER_H
#define TRANSACTIONMANAGER_H

#include <vector>
#include <string>
#include "../core/Transaction.h"

class TransactionManager {
private:
    std::vector<Transaction> transactions;
    std::string dataFile;
    int nextId;

    void loadTransactions();
    void saveTransactions();

public:
    TransactionManager(const std::string& filename = "data/transactions.json");
    
    void addTransaction(int userId, const std::string& type, double amount, const std::string& category, const std::string& date, const std::string& merchant = "");
    std::vector<Transaction> getTransactionsByUserId(int userId) const;
    bool deleteTransaction(int transactionId);
    bool updateTransaction(int transactionId, const std::string& type, double amount, const std::string& category, const std::string& date, const std::string& merchant);
    void clearUserTransactions(int userId);
    
    const std::vector<Transaction>& getAllTransactions() const;
};

#endif // TRANSACTIONMANAGER_H
