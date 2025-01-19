package com.jwojtas.movieweb.utilities;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Scanner;

public class CustomPasswordEncoder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Podaj hasło: ");
        String rawPassword = scanner.nextLine();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(rawPassword);

        System.out.println("Zahashowane hasło: " + hashedPassword);
    }
}