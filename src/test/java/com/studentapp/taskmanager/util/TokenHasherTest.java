package com.studentapp.taskmanager.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TokenHasherTest {

    @Test
    @DisplayName("Matches the known SHA-256 value for 'abc'")
    void matchesKnownSha256Value() {
        assertEquals("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
                TokenHasher.sha256("abc"));
    }

    @Test
    @DisplayName("The same input always gives the same hash")
    void sameInputGivesSameHash() {
        assertEquals(TokenHasher.sha256("my-token"), TokenHasher.sha256("my-token"));
    }

    @Test
    @DisplayName("Different inputs give different hashes, and the hash is 64 characters")
    void differentInputsGiveDifferentHashes() {
        assertNotEquals(TokenHasher.sha256("token-a"), TokenHasher.sha256("token-b"));
        assertEquals(64, TokenHasher.sha256("anything").length());
    }

    @Test
    @DisplayName("The hash never contains the original token")
    void hashDoesNotRevealToken() {
        String token = "SuperSecretToken123";
        assertFalse(TokenHasher.sha256(token).contains(token));
    }

    @Test
    @DisplayName("A null input is rejected")
    void nullInputIsRejected() {
        assertThrows(IllegalArgumentException.class, () -> TokenHasher.sha256(null));
    }
}
