package ssafy.runner.controller.partner;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ssafy.runner.domain.dto.TestDto;
import ssafy.runner.domain.enums.UserType;
import ssafy.runner.service.PartnerService;
import ssafy.runner.util.JwtUtil;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;

@RestController
@Api(tags = {"테스트용 API"})
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final JwtUtil jwtUtil;
    private final PartnerService partnerService;

    @GetMapping("")
    @ApiOperation(value = "테스트")
    public String sayHello() {
        return "hello";
    }

    @GetMapping("/login")
    @ApiOperation(value = "테스트")
    public String login() {
        partnerService.join("wns312@naver.com", "password");
        String token = jwtUtil.createToken("wns312@naver.com", "password", UserType.PARTNER);
        return token;
    }

    @GetMapping("/innerpage")
    @ApiOperation(value = "테스트")
    public String innerPage(Authentication authentication) {
        return (String) authentication.getPrincipal();
    }

    @PostMapping("/partner")
    @ApiOperation(value = "사업자 등록 테스트")
    public void checkPartner(@RequestBody TestDto params) throws Exception {

        String host = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=";
        String serviceKey = "hoxrqCIRhMCanug8aBYzxn%2BQjqLI3d8t0DHqIFHfZoLT7Jh%2BDVg01jEVBo6X%2FYSu3lveUiCX0sMUuXYQUToDOA%3D%3D";

        JSONObject requestBody = new JSONObject();
        ArrayList<String> objects = new ArrayList<>();
        objects.add(params.getB_no());
        requestBody.put("b_no", objects);

        URL url = new URL(host + serviceKey);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(connection.getOutputStream()));

        bw.write(requestBody.toJSONString());
        bw.flush();
        bw.close();

        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String response = in.readLine();
        System.out.println("response = " + response);
    }
}
