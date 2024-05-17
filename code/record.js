// let recordButton = document.getElementById("recordButton");
// document.addEventListener('DOMContentLoaded', function() {
//     let selectButton1 = document.getElementById("select1");
//     let selectButton2 = document.getElementById("select2");
//     let selectButton3 = document.getElementById("select3");
//     let mediaRecorder;
//     let audioChunks = [];
//     let recognition;

//     // 레벤슈타인 거리 함수
//     function levenshtein(a, b) {
//         const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));

//         for (let i = 1; i <= a.length; i++) {
//             for (let j = 1; j <= b.length; j++) {
//                 const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
//                 matrix[i][j] = Math.min(
//                     matrix[i - 1][j] + 1,                 // 삭제
//                     matrix[i][j - 1] + 1,                 // 삽입
//                     matrix[i - 1][j - 1] + substitutionCost // 대체
//                 );
//             }
//         }

//         return matrix[a.length][b.length];
//     }

//     recordButton.onclick = function() {
//         if (mediaRecorder && mediaRecorder.state === "recording") {
//             mediaRecorder.stop();
//             recordButton.textContent = "녹음 시작";
//         } else {
//             navigator.mediaDevices.getUserMedia({ audio: true })
//             .then(stream => {
//                 mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
//                 mediaRecorder.start();
//                 recordButton.textContent = "녹음 중지";

//                 audioChunks = [];
//                 mediaRecorder.ondataavailable = function(event) {
//                     audioChunks.push(event.data);
//                 };

//                 mediaRecorder.onstop = function() {
//                     const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav' });
//                     sendAudioToServer(audioBlob);
//                 };

//                 // 음성 인식 설정
//                 if ('webkitSpeechRecognition' in window) {
//                     recognition = new webkitSpeechRecognition();
//                 } else if ('SpeechRecognition' in window) {
//                     recognition = new SpeechRecognition();
//                 } else {
//                     alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
//                     return;
//                 }

//                 recognition.lang = 'ko-KR';
//                 recognition.interimResults = true;
//                 recognition.continuous = true;

//                 recognition.onresult = function(event) {
//                     let interimTranscript = '';
//                     for (let i = event.resultIndex; i < event.results.length; i++) {
//                         if (event.results[i].isFinal) {
//                             mediaRecorder.stop();
//                             recordButton.textContent = "녹음 시작";
//                             recognition.stop();
//                         } else {
//                             interimTranscript += event.results[i][0].transcript;
//                         }
//                     }
//                 };

//                 recognition.start();
//             });
//         }
//     };

//     function sendAudioToServer(audioBlob) {
//         const formData = new FormData();
//         formData.append("file", audioBlob);

//         fetch('http://3.106.251.131:5000/recognize', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert("인식된 텍스트: " + data.transcript);
//             selectClosestButton(data.transcript);
//         })
//         .catch(error => console.error("Error:", error));
//     }

//     function selectClosestButton(transcript) {
//         const buttons = [selectButton1, selectButton2, selectButton3];
//         let minDistance = Infinity;
//         let closestButton;

//         buttons.forEach(button => {
//             const distance = levenshtein(transcript, button.innerHTML);
//             if (distance < minDistance) {
//                 minDistance = distance;
//                 closestButton = button;
//             }
//         });

//         if (closestButton) {
//             closestButton.click(); // 가장 가까운 버튼을 프로그래매틱하게 클릭
//             alert("클릭된 버튼: " + closestButton.innerHTML); // 콘솔에 클릭된 버튼의 텍스트를 로그
//         } else {
//             console.error("가장 가까운 버튼을 찾을 수 없습니다.");
//         }
//     }
// });
// 자소 분리 함수
function decomposeHangul(syllable) {
    const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    
    const code = syllable.charCodeAt(0) - 44032;
    
    const cho = Math.floor(code / 588);
    const jung = Math.floor((code - (cho * 588)) / 28);
    const jong = code % 28;
    
    return [CHO[cho], JUNG[jung], JONG[jong]].join("");
}

// 문자열을 자소 단위로 분리하는 함수
function decomposeString(str) {
    return str.split("").map(char => {
        const code = char.charCodeAt(0);
        if (code >= 44032 && code <= 55203) { // 한글 음절 범위
            return decomposeHangul(char);
        }
        return char; // 한글이 아니면 그대로 반환
    }).join("");
}

// 레벤슈타인 거리 함수 (자소 분리 적용)
function levenshtein(a, b) {
    const decompA = decomposeString(a);
    const decompB = decomposeString(b);

    const matrix = Array.from({ length: decompA.length + 1 }, (_, i) => Array.from({ length: decompB.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));

    for (let i = 1; i <= decompA.length; i++) {
        for (let j = 1; j <= decompB.length; j++) {
            const substitutionCost = decompA[i - 1] === decompB[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,                 // 삭제
                matrix[i][j - 1] + 1,                 // 삽입
                matrix[i - 1][j - 1] + substitutionCost // 대체
            );
        }
    }

    return matrix[decompA.length][decompB.length];
}

// 기존 코드 유지
let recordButton = document.getElementById("recordButton");
document.addEventListener('DOMContentLoaded', function() {
    let selectButton1 = document.getElementById("select1");
    let selectButton2 = document.getElementById("select2");
    let selectButton3 = document.getElementById("select3");
    let mediaRecorder;
    let audioChunks = [];
    let recognition;

    recordButton.onclick = function() {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            recordButton.textContent = "녹음 시작";
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorder.start();
                recordButton.textContent = "녹음 중지";

                audioChunks = [];
                mediaRecorder.ondataavailable = function(event) {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = function() {
                    const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav' });
                    sendAudioToServer(audioBlob);
                };

                // 음성 인식 설정
                if ('webkitSpeechRecognition' in window) {
                    recognition = new webkitSpeechRecognition();
                } else if ('SpeechRecognition' in window) {
                    recognition = new SpeechRecognition();
                } else {
                    alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
                    return;
                }

                recognition.lang = 'ko-KR';
                recognition.interimResults = true;
                recognition.continuous = true;

                recognition.onresult = function(event) {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            mediaRecorder.stop();
                            recordButton.textContent = "녹음 시작";
                            recognition.stop();
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                };

                recognition.start();
            });
        }
    };

    function sendAudioToServer(audioBlob) {
        const formData = new FormData();
        formData.append("file", audioBlob);

        fetch('http://3.106.251.131:5000/recognize', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert("인식된 텍스트: " + data.transcript);
            selectClosestButton(data.transcript);
        })
        .catch(error => console.error("Error:", error));
    }

    function selectClosestButton(transcript) {
        const buttons = [selectButton1, selectButton2, selectButton3];
        let minDistance = Infinity;
        let closestButton;

        buttons.forEach(button => {
            const distance = levenshtein(transcript, button.innerHTML);
            if (distance < minDistance) {
                minDistance = distance;
                closestButton = button;
            }
        });

        if (closestButton) {
            closestButton.click(); // 가장 가까운 버튼을 프로그래매틱하게 클릭
            alert("클릭된 버튼: " + closestButton.innerHTML); // 콘솔에 클릭된 버튼의 텍스트를 로그
        } else {
            console.error("가장 가까운 버튼을 찾을 수 없습니다.");
        }
    }
});
