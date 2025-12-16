package com.work.ProjectManager.utils;

import com.work.ProjectManager.jira.dto.JiraProjectDTO;

public class ApiResponse {

    private boolean success;
    private Object data;
    private String error;

    public ApiResponse() {}

    public ApiResponse(boolean success, Object data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
