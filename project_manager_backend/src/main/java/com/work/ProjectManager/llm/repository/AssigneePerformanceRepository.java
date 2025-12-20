package com.work.ProjectManager.llm.repository;

import com.work.ProjectManager.llm.entity.AssigneePerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssigneePerformanceRepository extends JpaRepository<AssigneePerformance, String> {
    Optional<AssigneePerformance> findByAccountId(String accountId);
}

