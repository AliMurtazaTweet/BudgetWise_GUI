#include "TransactionManager.h"
#include "../utils/FileHandler.h"
#include <algorithm>

TransactionManager::TransactionManager(const std::string& filename) : dataFile(filename), nextId(1) {
    loadTransactions();
}

void TransactionManager::loadTransactions() {
    json j = FileHandler::loadFromFile(dataFile);
    transactions.clear();
    for (const auto& item : j) {
        transactions.push_back(Transaction::fromJson(item));
        if (transactions.back().getId() >= nextId) {
            nextId = transactions.back().getId() + 1;
        }
    }
}

void TransactionManager::saveTransactions() {
    json j = json::array();
    for (const auto& t : transactions) {
        j.push_back(t.toJson());
    }
    FileHandler::saveToFile(dataFile, j);
}

void TransactionManager::addTransaction(int userId, const std::string& type, double amount, const std::string& category, const std::string& date, const std::string& merchant) {
    Transaction newTransaction(nextId++, userId, type, amount, category, date, merchant);
    transactions.push_back(newTransaction);
    saveTransactions();
}

std::vector<Transaction> TransactionManager::getTransactionsByUserId(int userId) const {
    std::vector<Transaction> userTransactions;
    for (const auto& t : transactions) {
        if (t.getUserId() == userId) {
            userTransactions.push_back(t);
        }
    }
    return userTransactions;
}

bool TransactionManager::deleteTransaction(int transactionId) {
    for (auto it = transactions.begin(); it != transactions.end(); ++it) {
        if (it->getId() == transactionId) {
            transactions.erase(it);
            saveTransactions();
            return true;
        }
    }
    return false;
}

bool TransactionManager::updateTransaction(int transactionId, const std::string& type, double amount, const std::string& category, const std::string& date, const std::string& merchant) {
    for (auto& t : transactions) {
        if (t.getId() == transactionId) {
            t.setType(type);
            t.setAmount(amount);
            t.setCategory(category);
            t.setDate(date);
            t.setMerchant(merchant);
            saveTransactions();
            return true;
        }
    }
    return false;
}

void TransactionManager::clearUserTransactions(int userId) {
    transactions.erase(
        std::remove_if(transactions.begin(), transactions.end(),
            [userId](const Transaction& t) { return t.getUserId() == userId; }),
        transactions.end()
    );
    nextId = 1;
    for (const auto& t : transactions) {
        if (t.getId() >= nextId) nextId = t.getId() + 1;
    }
    saveTransactions();
}

const std::vector<Transaction>& TransactionManager::getAllTransactions() const {
    return transactions;
}
