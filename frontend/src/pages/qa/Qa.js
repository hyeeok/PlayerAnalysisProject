import React from 'react';

function Qa() {
    const qa = [
        {
            question: "질문: 스포츠 분석에 대해 궁금한 점이 있으신가요?",
            answer: "답변: 스포츠 분석은 경기 데이터와 통계를 분석하여 팀이나 선수의 성과를 평가하고 전략을 개발하는 과정입니다."
        },
        {
            question: "질문: 어떤 종류의 스포츠가 대상으로 분석이 이루어질까요?",
            answer: "답변: 스포츠 분석은 다양한 종목의 경기를 대상으로 이루어집니다. 축구, 농구, 야구, 테니스 등 다양한 스포츠에서 분석이 활용됩니다."
        },
        {
            question: "질문: 스포츠 분석은 어떤 도구나 기술을 사용하나요?",
            answer: "답변: 스포츠 분석에는 데이터 수집 도구, 통계 분석 소프트웨어, 시각화 도구 등 다양한 도구와 기술이 사용됩니다."
        }
        // 추가적인 질문과 답변을 이어서 작성할 수 있습니다.
    ];

    return (
        <div>
            <h2>Q&A</h2>
            {qa.map((item, index) => (
                <div key={index}>
                    <h3>{item.question}</h3>
                    <h3>{item.answer}</h3>
                </div>
            ))}
        </div>
    );
}

export default Qa;
