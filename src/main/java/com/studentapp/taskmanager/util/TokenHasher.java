package com.studentapp.taskmanager.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/** Turns a login token into a SHA-256 fingerprint, so the database never stores the real token. */
public final class TokenHasher {

    private TokenHasher() {
    }

    public static String sha256(String text) {
        if (text == null) {
            throw new IllegalArgumentException("Text to hash must not be null");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(text.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
