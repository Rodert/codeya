package wechat

import (
	"codeya-backend/internal/config"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type Code2SessionResponse struct {
	OpenID     string `json:"openid"`
	SessionKey string `json:"session_key"`
	UnionID    string `json:"unionid,omitempty"`
	ErrCode    int    `json:"errcode,omitempty"`
	ErrMsg     string `json:"errmsg,omitempty"`
}

// Code2Session 通过 code 换取 openid 和 session_key
func Code2Session(code string) (*Code2SessionResponse, error) {
	apiURL := "https://api.weixin.qq.com/sns/jscode2session"
	
	params := url.Values{}
	params.Set("appid", config.Cfg.Wechat.AppID)
	params.Set("secret", config.Cfg.Wechat.AppSecret)
	params.Set("js_code", code)
	params.Set("grant_type", "authorization_code")
	
	fullURL := fmt.Sprintf("%s?%s", apiURL, params.Encode())
	
	resp, err := http.Get(fullURL)
	if err != nil {
		return nil, fmt.Errorf("failed to call wechat api: %w", err)
	}
	defer resp.Body.Close()
	
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}
	
	var result Code2SessionResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}
	
	if result.ErrCode != 0 {
		return nil, fmt.Errorf("wechat api error: %d - %s", result.ErrCode, result.ErrMsg)
	}
	
	if result.OpenID == "" {
		return nil, fmt.Errorf("empty openid in response")
	}
	
	return &result, nil
}


