import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6">
      <div className="max-w-[480px] mx-auto px-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">BODHIS</h3>
          <p className="text-sm text-gray-600">
            불교 통합 플랫폼
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">사업자 정보</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <p>상호명: 소프트맥스삼공일(SoftMax301) </p>
            <p>대표자: 김시훈  </p>
            <p>사업자등록번호: 384-74-00438</p>
            <p>주소: 서울특별시 관악구 신림로 72</p>
            <p>이메일: softmax0301@gmail.com</p>
            <p>전화번호: 010-3871-7727</p>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          <p>© 2025 SoftMax301. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 