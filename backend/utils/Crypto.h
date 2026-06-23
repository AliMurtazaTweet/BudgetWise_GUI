#ifndef CRYPTO_H
#define CRYPTO_H

#include <string>

// Lightweight password hashing helpers.
// Strategy: per-user random salt + SHA-256(salt || password), stored as
//   "<hex-salt>$<hex-hash>"
// This is a minimal improvement over plaintext; for production prefer
// libsodium's crypto_pwhash (Argon2id) or a vetted KDF.
class Crypto {
public:
    // Hash a password with a freshly generated salt.
    // Returns a string of the form "<saltHex>$<hashHex>".
    static std::string hashPassword(const std::string& password);

    // Verify a candidate password against a stored "<saltHex>$<hashHex>" value.
    // Trims/normalizes the candidate before comparison.
    static bool verifyPassword(const std::string& candidate, const std::string& stored);

    // Lowercase + trim helper.
    static std::string normalize(const std::string& s);
};

#endif // CRYPTO_H