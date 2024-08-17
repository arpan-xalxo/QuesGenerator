"use client"

import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Skeleton, Typography, styled } from '@mui/material';



const PdfDropzone = () => {

  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
 


  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
        setFile(acceptedFiles[0]); // Save the uploaded file
      }
    }
  });
 

  const handleFileUpload = (file: string | Blob) => {

    const formData = new FormData();
    formData.set('file', file);

    setLoading(true);

    fetch('api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setQuestions(data.questions); 
        } else {
          console.error('Failed to generate questions:', data.error);
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error uploading file:', error);
      });
  };
   




  return (
    <>
      <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh', 
    }}
  >
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
    >
    {/* the whitebox */}
      <Box
        sx={{
          padding: 8,
          borderRadius: '8px',
        }}
      >
       
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: 2,
            paddingBottom: 1,
            height: '15vh', 
            border: '2px dashed gray',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
    
            }}
          >
              <img
                src='../images/file-upload.svg'
                alt="Upload Icon"
                width={100}
                height={100}
              />
            </Box>
          <Typography
          sx={{
            fontSize:20,
            fontWeight:'bold',
            padding:1
          }}
          >
            Drag and drop a PDF file here, or click to select one from your device
          </Typography>
        </Box>

        {/* shimmering effect */}
        {loading && (
          <Box sx={{ marginTop: 2,  height: '35vh', }}>
            {[...Array(3)].map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton
                  variant="text"
                  width="95%"
                  height={20}
                  animation="wave"
                  sx={{
                    marginBottom: 1,
                    background: 'linear-gradient(90deg, #e0e0e0 25%, #FFE800 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'waveEffect 4s infinite',
                  }}
                />
                <Skeleton
                  variant="text"
                  width="55%"
                  height={20}
                  animation="wave"
                  sx={{
                    marginBottom: 1,
                    background: 'linear-gradient(90deg, #e0e0e0 25%, #FFE800 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'waveEffect 4s infinite',
                  }}
                />
                <Skeleton
                  variant="text"
                  width="25%"
                  height={20}
                  animation="wave"
                  sx={{
                    marginBottom: 1,
                    background: 'linear-gradient(90deg, #e0e0e0 25%, #FFE800 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'waveEffect 4s infinite',
                  }}
                />
              </React.Fragment>
            ))}
          </Box>
        )}

        {!loading && questions.length > 0 && (
          <Box
            sx={{
              marginTop: 2,
              padding: 1,
              color: 'white',
              borderRadius: '8px',
              borderColor:'white',
              height: '40vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                transition: 'background 0.3s ease',
              },
              '&:hover::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.6)',
              },
              '&:hover::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 'bold',
                marginBottom: 1,

              }}
            >
              Generated Questions:
            </Typography>
            {questions.map((question, index) => (
              <Typography key={index} sx={{ marginBottom: 1, fontSize: 19 }}>
                {index + 1}. {question}
              </Typography>
              
              
            ))}
             <Box
      sx={{
        display: 'flex',
     justifyContent:'flex-end',
        paddingRight:40,
        marginTop: 3,
       
      }}
    >
              {!loading && questions.length > 0 && (
              <Button
              onClick={() => file && handleFileUpload(file)} // Replace with actual file if needed
                sx={{
               
                display:"inline-flex",
                  padding:'5px 28px',
                  borderRadius: '8px', // Rectangular with rounded corners
                  backgroundColor: 'black',
                  border: '2px solid yellow',
                  color: 'yellow',
                  fontWeight: 'bold',
                 
                  fontSize: 12,
                  '&:hover': {
                    backgroundColor: 'yellow',
                    borderColor: 'yellow',
                    color:"black"
                  },
                }}
              >
                Follow Up
              </Button>
            )}
            </Box>
          </Box>
        )}
       
        
      </Box>
    </Box>
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'black', // Just a white screen for now
        height: '100vh', 
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
       
      }}
    >
  <Typography
          sx={{
            padding: 1,
            paddingLeft: 3,
            fontSize: 70,
            display: 'flex',
            justifyContent: 'flex-start',
            color: '#FFE800',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            borderRight: '4px solid #FFE800',
            animation: 'typing 7s steps(30, end) 4s infinite, blink-caret 0.8s step-end infinite',

          }}
        >
        Question Generator.
        </Typography>

    </Box>
  </Box>
  <style jsx global>
    {`
      @keyframes typing {
      0%, 100% { width: 0; }
      50% { width: 85%; }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: #FFE800; }
    }
    @keyframes waveEffect {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `}</style>
    </>
  );
};

export default PdfDropzone;
