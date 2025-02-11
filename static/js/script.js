/**
 * imgsALT - Image Alt Text Generator
 * Client-side functionality for the imgsALT web app
 * 
 * Version: 1.0.0
 * Author: NC Jones @ndyjones
 * License: MIT
 * Created: February 2025
 * 
 * This script handles:
 * - File upload interactions (drag & drop, file selection)
 * - Image preview functionality
 * - API communication for alt text generation
 * - Copy-to-clipboard functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const uploadForm = document.getElementById('uploadForm');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('preview');
    
    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#4299e1';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#cbd5e0';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#cbd5e0';
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            showPreview(e.dataTransfer.files[0]);
        }
    });

    // Handle file input change
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            showPreview(e.target.files[0]);
        }
    });

    // Show image preview
    function showPreview(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image file');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('result').classList.add('hidden');
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('altText').textContent = data.alt_text;
                document.getElementById('result').classList.remove('hidden');
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            alert('An error occurred while uploading the image');
            console.error(error);
        } finally {
            document.getElementById('loading').classList.add('hidden');
        }
    });

    // Handle copy button
    document.getElementById('copyButton').addEventListener('click', () => {
        const altText = document.getElementById('altText').textContent;
        navigator.clipboard.writeText(altText)
            .then(() => {
                const copyButton = document.getElementById('copyButton');
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<span class="icon">✓</span> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                }, 2000);
            })
            .catch(() => {
                alert('Failed to copy text to clipboard');
            });
    });
});