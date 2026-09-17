import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

interface SkillGroup {
  category: string;
  icon: string;
  accent: 'blue' | 'green' | 'purple';
  skills: string[];
}

interface Project {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  tags: string[];
  repository: string;
  slides: Array<{ type: 'image' | 'video'; source: string; alt: string }>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutCanvas') aboutCanvas?: ElementRef<HTMLCanvasElement>;

  isMobileMenuOpen = false;
  messageSent = false;
  activeTestimonial = 0;
  showHirePulse = false;
  private aboutAnimationFrame = 0;
  private hirePulseTimeoutId?: number;
  private hirePulseIntervalId?: number;
  private aboutResizeObserver?: ResizeObserver;
  private aboutPointerMove = (event: PointerEvent): void => {
    this.aboutPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.aboutPointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  private aboutPointer = new THREE.Vector2();

  // Hero / About Data
  name = 'Chris Ejore';
  alias = 'C-Coder';
  title = 'Full-Stack Web & Mobile Application Engineer';
  location = 'Kasarani, Nairobi, Kenya';
  aboutText = 'Diploma in Information Technology graduate from KCA University, specializing in multi-tier software architectures, Django REST APIs, and custom Flutter mobile applications. Certified in Python OOP and modern UI/UX frontend architecture.';

  // Contact Info
  linkedinUrl = 'https://linkedin.com/in/chris-ejore';
  githubUrl = 'https://github.com/chrispusejore';
  cvFilePath = 'assets/Chris_Ejore_CV.pdf';

  // Tech Stack Data
  techStack: SkillGroup[] = [
    {
      category: 'Languages & Frameworks',
      icon: 'fa-solid fa-code',
      accent: 'blue',
      skills: ['Dart & Flutter', 'Python & Django', 'Angular', 'HTML5 / CSS3 / JavaScript']
    },
    {
      category: 'IDEs & Platforms',
      icon: 'fa-solid fa-screwdriver-wrench',
      accent: 'green',
      skills: ['Android Studio', 'Git & GitHub', 'PostgreSQL', 'Firebase']
    },
    {
      category: 'Core Competencies',
      icon: 'fa-solid fa-brain',
      accent: 'purple',
      skills: ['REST API Integration', 'Object-Oriented Software Design (OOP)', 'Mobile Architecture & Sessions', 'UI/UX Layout Optimization']
    }
  ];


  projects: Project[] = [
    {
      title: 'Beatz Platform',
      badge: 'CodeAlpha Task 2',
      subtitle: 'Full-Stack Social Music App',
      description: 'Architected a full-stack social platform pairing a Python/Django backend with a mobile UI developed in Android Studio using Flutter. Integrated database models, REST APIs, user session handling, and a custom dark/neon design scheme.',
      tags: ['Django', 'Flutter', 'REST API'],
      repository: 'https://github.com/ChrisEjore/codealpha_tasks/tree/main/Task2',
      slides: [
        { type: 'video', source: 'assets/videos/beatz-social-feed.mp4', alt: 'Beatz social feed project demonstration' },
        { type: 'video', source: 'assets/videos/task2-main-dart.mp4', alt: 'Beatz mobile app demonstration' }
      ]
    },
    {
      title: 'NAWI TRENDS',
      badge: 'CodeAlpha Task 1',
      subtitle: 'E-Commerce Web Application',
      description: 'Engineered and deployed a full-stack e-commerce application equipped with custom catalog management and optimized navigation. Managed source structures under codealpha_tasks repository and released a public showcase on LinkedIn.',
      tags: ['Python', 'Web Frameworks', 'Git'],
      repository: 'https://github.com/ChrisEjore/codealpha_tasks/tree/main/Task1',
      slides: [
        { type: 'image', source: 'assets/images/ai-story-writer.jpeg', alt: 'NAWI TRENDS application screen' },
        { type: 'image', source: 'assets/images/bedtime-stories.jpeg', alt: 'NAWI TRENDS catalog screen' }
      ]
    },
    {
      title: 'Bedtime Stories',
      badge: 'folklore_app',
      subtitle: 'African Folklore & Voice Studio',
      description: 'A storytelling application preserving African folklore through an immersive story library, parent voice recordings, and an adaptive AI narrator.',
      tags: ['Kotlin', 'Jetpack Compose', 'MVVM'],
      repository: 'https://github.com/ChrisEjore/folklore_app',
      slides: [
        { type: 'image', source: '/assets/projects/bedtime-stories/home.jpeg', alt: 'Bedtime Stories home screen' },
        { type: 'image', source: '/assets/projects/bedtime-stories/reader.jpeg', alt: 'Bedtime Stories reader screen' },
        { type: 'image', source: '/assets/projects/bedtime-stories/voice-studio.jpeg', alt: 'Bedtime Stories voice studio screen' },
        { type: 'image', source: '/assets/projects/bedtime-stories/ai-writer.jpeg', alt: 'Bedtime Stories AI writer screen' }
      ]
    },
    {
      title: 'StaffHub',
      badge: '-Employee',
      subtitle: 'Employee Management System',
      description: 'A Flutter workflow prototype with login, validated employee registration, confirmation flows, and interactive staff profiles.',
      tags: ['Flutter', 'Dart', 'Material 3'],
      repository: 'https://github.com/ChrisEjore/-Employee',
      slides: [
        { type: 'image', source: '/assets/projects/staffhub/splash.jpeg', alt: 'StaffHub splash screen' },
        { type: 'image', source: '/assets/projects/staffhub/login.jpeg', alt: 'StaffHub login screen' },
        { type: 'image', source: '/assets/projects/staffhub/dashboard.jpeg', alt: 'StaffHub employee management dashboard' },
        { type: 'image', source: '/assets/projects/staffhub/register-fields.jpeg', alt: 'StaffHub employee registration form fields' },
        { type: 'image', source: '/assets/projects/staffhub/register-details.jpeg', alt: 'StaffHub employee registration details' },
        { type: 'image', source: '/assets/projects/staffhub/about.jpeg', alt: 'StaffHub about application screen' }
      ]
    }
  ];

  activeProjectSlides = this.projects.map(() => 0);

  testimonials = [
    { quote: 'Chris brings unusual care to both the architecture and the experience. He made a complex product feel clear, fast, and genuinely enjoyable to use.', initials: 'AM', name: 'Amina M.', role: 'Product collaborator' },
    { quote: 'A thoughtful engineer who asks the right questions, communicates clearly, and ships work you can trust. I would happily work with Chris again.', initials: 'DK', name: 'Daniel K.', role: 'Project lead' },
    { quote: 'The difference was in the details. Every interaction felt intentional, and the final product was both beautiful and dependable.', initials: 'NW', name: 'Nia W.', role: 'Creative partner' }
  ];

  ngAfterViewInit(): void {
    this.createAboutScene();
    this.startHirePulse();
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.aboutAnimationFrame);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.aboutPointerMove);
      this.aboutResizeObserver?.disconnect();
    }

    if (this.hirePulseTimeoutId) {
      clearTimeout(this.hirePulseTimeoutId);
    }

    if (this.hirePulseIntervalId) {
      clearInterval(this.hirePulseIntervalId);
    }
  }

  private startHirePulse(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.hirePulseIntervalId = window.setInterval(() => {
      this.showHirePulse = true;

      if (this.hirePulseTimeoutId) {
        clearTimeout(this.hirePulseTimeoutId);
      }

      this.hirePulseTimeoutId = window.setTimeout(() => {
        this.showHirePulse = false;
      }, 5000);
    }, 10000);

    this.hirePulseTimeoutId = window.setTimeout(() => {
      this.showHirePulse = true;
      this.hirePulseTimeoutId = window.setTimeout(() => {
        this.showHirePulse = false;
      }, 5000);
    }, 0);
  }

  private createAboutScene(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const canvas = this.aboutCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const container = canvas.parentElement;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 7;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const atom = new THREE.Group();
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0x12356a, emissive: 0x1769ff, emissiveIntensity: 1.4, roughness: 0.3, metalness: 0.35 })
    );
    atom.add(nucleus);
    atom.add(this.createAboutText());
    atom.add(this.createOrbit(0.2));
    atom.add(this.createOrbit(-0.55));
    scene.add(atom);
    scene.add(new THREE.AmbientLight(0x8db8ff, 1.5));
    const spotlight = new THREE.PointLight(0x5da2ff, 12, 10);
    spotlight.position.set(2, 3, 4);
    scene.add(spotlight);

    const resize = (): void => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    this.aboutResizeObserver = new ResizeObserver(resize);
    this.aboutResizeObserver.observe(container);
    window.addEventListener('pointermove', this.aboutPointerMove, { passive: true });

    const animate = (time: number): void => {
      this.aboutAnimationFrame = requestAnimationFrame(animate);
      atom.rotation.y = time * 0.00022 + this.aboutPointer.x * 0.18;
      atom.rotation.x = THREE.MathUtils.lerp(atom.rotation.x, this.aboutPointer.y * 0.12, 0.06);
      renderer.render(scene, camera);
    };
    this.aboutAnimationFrame = requestAnimationFrame(animate);
  }

  private createAboutText(): THREE.Sprite {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 256;
    textCanvas.height = 128;
    const context = textCanvas.getContext('2d');
    if (context) {
      context.font = '900 88px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = '#6db5ff';
      context.shadowBlur = 24;
      context.fillStyle = '#b9ddff';
      context.fillText('CE', 128, 64);
    }
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(textCanvas), transparent: true, blending: THREE.AdditiveBlending }));
    sprite.scale.set(1.5, 0.75, 1);
    sprite.position.z = 1.05;
    return sprite;
  }

  private createOrbit(rotationZ: number): THREE.Line {
    const points: THREE.Vector3[] = [];
    for (let index = 0; index <= 96; index += 1) {
      const angle = (index / 96) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 2.15, Math.sin(angle) * 0.68, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.ShaderMaterial({
      uniforms: { blue: { value: new THREE.Color('#3b82f6') }, purple: { value: new THREE.Color('#a855f7') } },
      vertexShader: 'varying float path; void main() { path = position.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 blue; uniform vec3 purple; varying float path; void main() { float blend = smoothstep(-2.15, 2.15, path); gl_FragColor = vec4(mix(purple, blue, blend), 0.9); }',
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.x = Math.PI * 0.62;
    orbit.rotation.z = rotationZ;
    return orbit;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onSubmit(): void {
    this.messageSent = true;
  }

  showProjectSlide(projectIndex: number, direction: 1 | -1): void {
    const slideCount = this.projects[projectIndex].slides.length;
    this.activeProjectSlides[projectIndex] =
      (this.activeProjectSlides[projectIndex] + direction + slideCount) % slideCount;
  }

  nextTestimonial(): void {
    this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
  }

  previousTestimonial(): void {
    this.activeTestimonial = (this.activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
