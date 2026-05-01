// Simple test for upload endpoint
const testUpload = async () => {
  try {
    // Test if endpoint is accessible
    const testResponse = await fetch('http://localhost:5000/api/upload/test');
    const testData = await testResponse.json();
    console.log('Test endpoint response:', testData);
    
    // Test actual upload with a simple file
    const formData = new FormData();
    
    // Create a simple test file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.toBlob(async (blob) => {
      formData.append('logo', blob, 'test-logo.png');
      
      console.log('Sending upload request...');
      const uploadResponse = await fetch('http://localhost:5000/api/upload/logo', {
        method: 'POST',
        body: formData
      });
      
      const uploadData = await uploadResponse.json();
      console.log('Upload response:', uploadData);
    }, 'image/png');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run test when page loads
window.addEventListener('load', testUpload);