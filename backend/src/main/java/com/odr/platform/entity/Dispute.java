package com.odr.platform.entity;

import jakarta.persistence.*;

@Entity
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String caseTitle;
    public String category;

    @Column(length = 3000)
    public String description;

    public String oppositePartyName;

    public String oppositePartyEmail;

    public String status = "FILED";
    public String priority = "MEDIUM";

    public String evidenceFileName;
    public String resolutionNote;
}
