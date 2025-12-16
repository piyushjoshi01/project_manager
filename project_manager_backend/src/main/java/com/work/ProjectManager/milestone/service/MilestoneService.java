package com.work.ProjectManager.milestone.service;

import com.work.ProjectManager.milestone.dto.MilestoneDTO;
import com.work.ProjectManager.milestone.dto.MilestoneRequestDTO;
import com.work.ProjectManager.milestone.entity.Milestone;
import com.work.ProjectManager.milestone.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;

    @Transactional
    public MilestoneDTO createMilestone(MilestoneRequestDTO requestDTO) {
        Milestone milestone = new Milestone();
        milestone.setName(requestDTO.getName());
        milestone.setStartDate(requestDTO.getStartDate());
        milestone.setEndDate(requestDTO.getEndDate());
        milestone.setDescription(requestDTO.getDescription());
        
        Milestone saved = milestoneRepository.save(milestone);
        return convertToDTO(saved);
    }

    @Transactional
    public List<MilestoneDTO> createMilestones(List<MilestoneRequestDTO> requestDTOs) {
        List<Milestone> milestones = requestDTOs.stream()
                .map(dto -> {
                    Milestone milestone = new Milestone();
                    milestone.setName(dto.getName());
                    milestone.setStartDate(dto.getStartDate());
                    milestone.setEndDate(dto.getEndDate());
                    milestone.setDescription(dto.getDescription());
                    return milestone;
                })
                .collect(Collectors.toList());
        
        List<Milestone> saved = milestoneRepository.saveAll(milestones);
        return saved.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MilestoneDTO> getAllMilestones() {
        return milestoneRepository.findAllByOrderByStartDateAsc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MilestoneDTO getMilestoneById(Long id) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found with id: " + id));
        return convertToDTO(milestone);
    }

    @Transactional
    public MilestoneDTO updateMilestone(Long id, MilestoneRequestDTO requestDTO) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found with id: " + id));
        
        milestone.setName(requestDTO.getName());
        milestone.setStartDate(requestDTO.getStartDate());
        milestone.setEndDate(requestDTO.getEndDate());
        milestone.setDescription(requestDTO.getDescription());
        
        Milestone updated = milestoneRepository.save(milestone);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteMilestone(Long id) {
        if (!milestoneRepository.existsById(id)) {
            throw new RuntimeException("Milestone not found with id: " + id);
        }
        milestoneRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllMilestones() {
        milestoneRepository.deleteAll();
    }

    private MilestoneDTO convertToDTO(Milestone milestone) {
        return new MilestoneDTO(
                milestone.getId(),
                milestone.getName(),
                milestone.getStartDate(),
                milestone.getEndDate(),
                milestone.getDescription()
        );
    }
}

