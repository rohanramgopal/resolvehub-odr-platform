package com.odr.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String fullName;

    @Column(unique = true)
    public String email;

    public String password;

    public String role = "USER";
}
