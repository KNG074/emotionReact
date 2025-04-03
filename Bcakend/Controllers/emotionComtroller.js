const emotions = {}; // ประกาศตัวแปร emotions

exports.receiveEmotion = (req, res) => {
  const { emotion, time } = req.body;

  if (!emotion || !time) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  if (emotions[emotion]) {
    emotions[emotion]++;
  } else {
    emotions[emotion] = 1;
  }

  // ส่ง response ด้วย JSON และ status 200 พร้อมข้อมูลที่ได้รับ
  res.status(200).json({
    message: 'Emotion received successfully',
    data: {
      emotion,
      time,
      emotionCounts: emotions,
    },
  });
};

exports.getEmotionCounts = (req, res) => {
  res.status(200).json(emotions);
};