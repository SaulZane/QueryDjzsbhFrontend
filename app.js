document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadForm = document.getElementById('uploadForm');
    const excelFile = document.getElementById('excelFile');
    const queryBtn = document.getElementById('queryBtn');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    const downloadResultBtn = document.getElementById('downloadResultBtn');
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    const successSection = document.getElementById('successSection');

    // 后端API地址
    const API_URL = 'http://17.34.1.130:8002'; // 修改为后端实际地址

    // 下载模板按钮点击事件
    downloadTemplateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 创建一个隐藏的iframe来下载文件，避免页面跳转
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${API_URL}/example`;
        document.body.appendChild(iframe);
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 5000);
    });

    // 下载结果按钮点击事件
    downloadResultBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // 创建一个隐藏的iframe来下载文件，避免页面跳转
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${API_URL}/finish`;
        document.body.appendChild(iframe);
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 5000);
    });

    // 表单提交事件
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 检查是否选择了文件
        if (!excelFile.files[0]) {
            showError('请选择一个Excel文件');
            return;
        }

        // 检查文件类型
        const file = excelFile.files[0];
        // 不严格检查MIME类型，因为有些浏览器可能不准确
        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            showError('请上传.xlsx格式的Excel文件');
            return;
        }

        // 创建FormData对象，确保使用正确的字段名
        const formData = new FormData();
        formData.append('file', file); // 确保字段名为'file'，与后端对应

        // 重置UI状态
        resetUI();
        
        // 显示进度区域
        progressSection.classList.remove('d-none');
        
        // 禁用查询按钮，防止重复提交
        queryBtn.disabled = true;
        queryBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 查询中...';

        // 使用fetch进行文件上传
        fetch(`${API_URL}/excel`, {
            method: 'POST',
            body: formData,
            // 不设置Content-Type，让浏览器自动设置multipart/form-data和boundary
        })
        .then(response => {
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 检查响应是否包含错误信息
            if (data && data.error) {
                showError(data.error);
                resetQueryButton();
                return;
            }
            
            // 开始轮询处理进度
            checkProgress();
        })
        .catch(error => {
            console.error('文件上传错误:', error);
            showError('上传文件时发生错误: ' + error.message);
            resetQueryButton();
        });
    });

    // 检查处理进度
    function checkProgress() {
        let lastProcess = 0;
        let stuckCount = 0;
        const maxStuckCount = 3; // 最大卡住次数
        const stuckTimeout = 5000; // 卡住判定时间（毫秒）

        let progressInterval = setInterval(() => {
            fetch(`${API_URL}/process`)
                .then(response => {
                    // 检查响应状态
                    if (!response.ok) {
                        throw new Error(`HTTP错误! 状态: ${response.status}`);
                    }
                    
                    // 检查是否返回的是JSON还是文件流
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json().then(data => {
                            // 更新进度信息
                            if (data.totaltoprocess > 0) {
                                const percentage = Math.round((data.process / data.totaltoprocess) * 100);
                                updateProgress(percentage, `处理进度: ${data.process}/${data.totaltoprocess}`);
                                
                                // 检查是否卡住
                                if (data.process === lastProcess) {
                                    stuckCount++;
                                    if (stuckCount >= maxStuckCount) {
                                        clearInterval(progressInterval);
                                        showError(`处理卡在第 ${data.process} 条数据，请检查该条数据是否正确`);
                                        resetQueryButton();
                                        return;
                                    }
                                } else {
                                    stuckCount = 0;
                                    lastProcess = data.process;
                                }
                                
                                // 如果处理完成，显示下载按钮
                                if (data.process === data.totaltoprocess && data.process > 0) {
                                    clearInterval(progressInterval);
                                    showSuccess();
                                }
                            }
                        });
                    } else {
                        // 如果不是JSON，说明处理已完成，返回了文件
                        clearInterval(progressInterval);
                        showSuccess();
                    }
                })
                .catch(error => {
                    console.error('检查进度错误:', error);
                    clearInterval(progressInterval);
                    showError('检查处理进度时发生错误: ' + error.message);
                    resetQueryButton();
                });
        }, 1000); // 每秒检查一次进度
    }

    // 更新进度条
    function updateProgress(percentage, text) {
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
        progressText.textContent = text;
    }

    // 显示错误信息
    function showError(message) {
        errorSection.classList.remove('d-none');
        errorMessage.textContent = message;
        progressSection.classList.add('d-none');
        successSection.classList.add('d-none');
    }

    // 显示成功信息
    function showSuccess() {
        successSection.classList.remove('d-none');
        progressSection.classList.add('d-none');
        errorSection.classList.add('d-none');
        resetQueryButton();
    }

    // 重置查询按钮
    function resetQueryButton() {
        queryBtn.disabled = false;
        queryBtn.innerHTML = '查询';
    }

    // 重置UI状态
    function resetUI() {
        errorSection.classList.add('d-none');
        successSection.classList.add('d-none');
        progressSection.classList.add('d-none');
        updateProgress(0, '');
    }
}); 