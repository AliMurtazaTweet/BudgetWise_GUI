#ifndef ANALYTICS_H
#define ANALYTICS_H

#include <vector>
#include <string>
#include <map>
#include "Transaction.h"

class Analytics {
public:
    static double calculateTotalIncome(const std::vector<Transaction>& transactions);
    static double calculateTotalExpense(const std::vector<Transaction>& transactions);
    static double calculateSavings(const std::vector<Transaction>& transactions);
    static std::string getTopSpendingCategory(const std::vector<Transaction>& transactions);
    static std::map<std::string, double> getCategoryBreakdown(const std::vector<Transaction>& transactions);
};

#endif // ANALYTICS_H
