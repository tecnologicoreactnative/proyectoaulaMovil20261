import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SEGMENTS = 18;
const FOOD_SIZE = 14;
const HEAD_SIZE = 22;
const DOT_SIZE = 11;

const rand = (min, max) => Math.random() * (max - min) + min;

const DragonGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [floatingPts, setFloatingPts] = useState([]);

  const foodPos = useRef({ x: 120, y: 60 });
  const foodAnim = useRef(new Animated.ValueXY({ x: 120, y: 60 })).current;
  const foodScale = useRef(new Animated.Value(1)).current;

  const points = useRef(
    Array.from({ length: SEGMENTS }, (_, i) =>
      new Animated.ValueXY({ x: 60 - i * 10, y: 70 })
    )
  ).current;

  const headPos = useRef({ x: 60, y: 70 });
  const scoreRef = useRef(0);
  const canvasOffset = useRef({ x: 0, y: 0 });
  const gameOverRef = useRef(false); // para evitar múltiples triggers

  // pulso comida
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(foodScale, { toValue: 1.3, duration: 400, useNativeDriver: true }),
        Animated.timing(foodScale, { toValue: 1,   duration: 400, useNativeDriver: true }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const spawnFood = useCallback(() => {
    const nx = rand(10, 240);
    const ny = rand(10, 130);
    foodPos.current = { x: nx, y: ny };
    foodAnim.setValue({ x: nx, y: ny });
  }, []);

  // ── CHEQUEO COLISIÓN COLA ──────────────────────
  const checkSelfCollision = useCallback(() => {
    if (gameOverRef.current) return;

    const hx = headPos.current.x;
    const hy = headPos.current.y;

    // Saltamos los primeros 5 segmentos (muy cerca de la cabeza)
    for (let i = 5; i < SEGMENTS; i++) {
      const sx = points[i].x._value;
      const sy = points[i].y._value;
      const dist = Math.sqrt((hx - sx) ** 2 + (hy - sy) ** 2);

      if (dist < 10) {
        gameOverRef.current = true;
        setGameOver(true);
        setPlaying(false);
        return;
      }
    }
  }, [points]);

  const checkEat = useCallback(() => {
    const hx = headPos.current.x;
    const hy = headPos.current.y;
    const fx = foodPos.current.x;
    const fy = foodPos.current.y;
    const dist = Math.sqrt((hx - fx) ** 2 + (hy - fy) ** 2);

    if (dist < 26) {
      const id = Date.now();
      setFloatingPts(prev => [...prev, { id, x: fx, y: fy }]);
      setTimeout(() => setFloatingPts(prev => prev.filter(p => p.id !== id)), 700);

      scoreRef.current += 1;
      setScore(scoreRef.current);
      setHighScore(h => Math.max(h, scoreRef.current));
      spawnFood();

      Animated.sequence([
        Animated.timing(foodScale, { toValue: 0,   duration: 80,  useNativeDriver: true }),
        Animated.timing(foodScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
        Animated.timing(foodScale, { toValue: 1,   duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [spawnFood]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!gameOverRef.current) setPlaying(true);
      },
      onPanResponderMove: (_, gesture) => {
        if (gameOverRef.current) return;

        const x = gesture.moveX - canvasOffset.current.x;
        const y = gesture.moveY - canvasOffset.current.y;
        headPos.current = { x, y };

        Animated.spring(points[0], {
          toValue: { x, y },
          useNativeDriver: false,
          speed: 22,
          bounciness: 0,
        }).start();

        for (let i = 1; i < SEGMENTS; i++) {
          const px = points[i - 1].x._value;
          const py = points[i - 1].y._value;
          Animated.spring(points[i], {
            toValue: { x: px, y: py },
            useNativeDriver: false,
            speed: 22,
            bounciness: 0,
          }).start();
        }

        checkEat();
        checkSelfCollision(); // ← chequeo colisión tras mover
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const reset = () => {
    scoreRef.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setGameOver(false);
    setPlaying(false);
    setFloatingPts([]);
    spawnFood();
    points.forEach((p, i) => p.setValue({ x: 60 - i * 10, y: 70 }));
    headPos.current = { x: 60, y: 70 };
  };

  return (
    <View style={s.wrapper}>

      {/* SCOREBOARD */}
      <View style={s.scoreboard}>
        <View style={s.scoreBox}>
          <Text style={s.scoreLabel}>SCORE</Text>
          <Text style={s.scoreVal}>{score}</Text>
        </View>
        <View style={s.centerTag}>
          <Text style={s.centerTagText}>🐉 DRAGON</Text>
        </View>
        <View style={s.scoreBox}>
          <Text style={s.scoreLabel}>BEST</Text>
          <Text style={s.scoreVal}>{highScore}</Text>
        </View>
      </View>

      {/* CANVAS */}
      <View
        {...panResponder.panHandlers}
        style={s.canvas}
        onLayout={(e) => {
          e.target.measure((fx, fy, width, height, px, py) => {
            canvasOffset.current = { x: px, y: py };
          });
        }}
      >
        {/* Grid decorativo */}
        {[0.25, 0.5, 0.75].map(f => (
          <View key={f} style={[s.gridLine, { top: `${f * 100}%` }]} />
        ))}

        {/* Comida */}
        <Animated.View
          style={[
            s.food,
            {
              transform: [
                { translateX: foodAnim.x },
                { translateY: foodAnim.y },
                { scale: foodScale },
              ],
            },
          ]}
        >
          <Text style={{ fontSize: 14 }}>🍖</Text>
        </Animated.View>

        {/* Puntos flotantes */}
        {floatingPts.map(p => (
          <Text key={p.id} style={[s.floatPt, { left: p.x, top: p.y }]}>
            +1
          </Text>
        ))}

        {/* Dragón */}
        {points.map((point, index) => (
          <Animated.View
            key={index}
            style={[
              s.dot,
              index === 0 ? s.head : null,
              {
                width:  index === 0 ? HEAD_SIZE : Math.max(4, DOT_SIZE - index * 0.2),
                height: index === 0 ? HEAD_SIZE : Math.max(4, DOT_SIZE - index * 0.2),
                opacity: index === 0 ? 1 : Math.max(0.15, 1 - index * 0.04),
                backgroundColor:
                  index === 0 ? '#FF6B6B'
                  : index < 4  ? '#FFB347'
                  :               '#E8C9A0',
                transform: point.getTranslateTransform(),
              },
            ]}
          />
        ))}

        {/* Overlay inicio */}
        {!playing && !gameOver && (
          <View style={s.overlay}>
            <Text style={s.overlayEmoji}>🐉</Text>
            <Text style={s.overlayTitle}>Arrastra para jugar</Text>
            <Text style={s.overlayHint}>Come 🍖 · No toques tu cola</Text>
          </View>
        )}

        {/* Game over */}
        {gameOver && (
          <View style={s.overlay}>
            <Text style={s.overlayEmoji}>💀</Text>
            <Text style={s.overlayTitle}>¡Te mordiste la cola!</Text>
            <Text style={s.overlayScore}>Puntuación: {score}</Text>
            <TouchableOpacity style={s.restartBtn} onPress={reset}>
              <Text style={s.restartText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#12122A',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  scoreBox: {
    alignItems: 'center',
  },

  scoreLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    fontWeight: '700',
  },

  scoreVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E8C9A0',
    lineHeight: 24,
  },

  centerTag: {
    backgroundColor: 'rgba(255,107,107,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },

  centerTagText: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '700',
    letterSpacing: 1,
  },

  canvas: {
    height: 160,
    backgroundColor: '#1A1A2E',
    overflow: 'hidden',
  },

  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  food: {
    position: 'absolute',
    width: FOOD_SIZE,
    height: FOOD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  floatPt: {
    position: 'absolute',
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
  },

  dot: {
    position: 'absolute',
    borderRadius: 50,
  },

  head: {
    zIndex: 10,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,42,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  overlayEmoji: {
    fontSize: 32,
  },

  overlayTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  overlayHint: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
  },

  overlayScore: {
    color: '#E8C9A0',
    fontSize: 13,
    fontWeight: '600',
  },

  restartBtn: {
    marginTop: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  restartText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default DragonGame;