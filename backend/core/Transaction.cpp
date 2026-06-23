#include "Transaction.h"

Transaction::Transaction() : id(0), userId(0), amount(0.0), merchant("") {}

Transaction::Transaction(int id, int userId, std::string type, double amount, std::string category, std::string date, std::string merchant)
    : id(id), userId(userId), type(type), amount(amount), category(category), date(date), merchant(merchant) {}

int Transaction::getId() const { return id; }
int Transaction::getUserId() const { return userId; }
std::string Transaction::getType() const { return type; }
double Transaction::getAmount() const { return amount; }
std::string Transaction::getCategory() const { return category; }
std::string Transaction::getDate() const { return date; }
std::string Transaction::getMerchant() const { return merchant; }

void Transaction::setId(int id) { this->id = id; }
void Transaction::setUserId(int userId) { this->userId = userId; }
void Transaction::setType(const std::string& type) { this->type = type; }
void Transaction::setAmount(double amount) { this->amount = amount; }
void Transaction::setCategory(const std::string& category) { this->category = category; }
void Transaction::setDate(const std::string& date) { this->date = date; }
void Transaction::setMerchant(const std::string& merchant) { this->merchant = merchant; }

json Transaction::toJson() const {
    return json{
        {"id", id},
        {"userId", userId},
        {"type", type},
        {"amount", amount},
        {"category", category},
        {"date", date},
        {"merchant", merchant}
    };
}

Transaction Transaction::fromJson(const json& j) {
    std::string m = j.contains("merchant") ? j.at("merchant").get<std::string>() : (j.contains("category") ? j.at("category").get<std::string>() : "");
    return Transaction(
        j.at("id").get<int>(),
        j.at("userId").get<int>(),
        j.at("type").get<std::string>(),
        j.at("amount").get<double>(),
        j.at("category").get<std::string>(),
        j.at("date").get<std::string>(),
        m
    );
}
