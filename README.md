# 🔐 Proyecto de Seguridad Informática - Pipeline CI/CD

Proyecto con autenticación OIDC y pipeline completo de CI/CD en GitHub Actions.

---

## 📋 ¿Qué se implementó?

### ✅ 1. **Linting con ESLint**
- Análisis de código para detectar errores sintácticos
- Validación de estándares de código
- Reglas de seguridad habilitadas

### ✅ 2. **SAST (Static Application Security Testing)**
- **Semgrep**: Detecta vulnerabilidades OWASP Top 10 y problemas de seguridad
- **Snyk**: Escanea dependencias en busca de vulnerabilidades conocidas (CVEs)

### ✅ 3. **Unit Tests con BDD**
- Framework: **Jest**
- Metodología: **Behavior-Driven Development** (GIVEN-WHEN-THEN)
- **9 tests unitarios** funcionando correctamente
- Generación de reportes de cobertura

---

## 🚀 Comandos disponibles

```bash
# Ejecutar el servidor
npm start

# Ejecutar linting
npm run lint

# Corregir errores de linting automáticamente
npm run lint:fix

# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage
```

---

## ⚙️ Configuración del Pipeline en GitHub

### **Paso 1: Configurar Snyk Token**

Ya tienes Snyk conectado al repositorio. Ahora necesitas agregar el token como secret:

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Nombre: `SNYK_TOKEN`
5. Valor: Tu token de Snyk (obtenerlo desde https://app.snyk.io/account)
6. Click en **Add secret**

### **Paso 2: Push al repositorio**

```bash
git add .
git commit -m "feat: Implementar pipeline CI/CD con Linting, SAST y Tests"
git push origin main
```

### **Paso 3: Verificar el Pipeline**

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás el workflow ejecutándose automáticamente
4. El pipeline se ejecutará en este orden:
   - 🔍 **Linting** → 🛡️ **SAST** (Semgrep + Snyk)
   - Si el linting pasa → 🧪 **Tests**

---

## 📊 Estructura del Pipeline

```
        Push/Pull Request
               ↓
        ┌──────────────┐
        │   LINTING    │  ← ESLint verifica código
        └──────┬───────┘
               │
        ┌──────┴───────┐
        ↓              ↓
   ┌─────────┐   ┌─────────┐
   │ SEMGREP │   │  SNYK   │  ← SAST en paralelo
   └─────────┘   └─────────┘
        │
        ↓
   ┌─────────┐
   │  TESTS  │  ← Solo si lint pasa
   └─────────┘
```

---

## 🧪 Tests Unitarios con BDD

Los tests siguen la metodología **GIVEN-WHEN-THEN**:

```javascript
describe("GIVEN configuración del servidor", () => {
  describe("WHEN se validan constantes", () => {
    test("THEN debe cumplir con la expectativa", () => {
      // Test implementation
    });
  });
});
```

### Tests implementados:
- ✅ Validación de puerto del servidor
- ✅ Validación de variables OIDC
- ✅ Configuración de seguridad (cookies httpOnly)
- ✅ Validación de secrets de sesión
- ✅ Propiedades de configuración OIDC
- ✅ Formato de URLs
- ✅ Disponibilidad de módulos de Node.js

---

## 🛡️ Herramientas SAST

### **Semgrep**
- Análisis open-source de seguridad
- Detecta: OWASP Top 10, secretos expuestos, vulnerabilidades en Node.js
- Se ejecuta en cada push/PR

### **Snyk**
- Análisis de vulnerabilidades en dependencias (npm)
- Detecta CVEs conocidos
- Proporciona recomendaciones de remediación
- **Requiere token configurado** (ver arriba)

---

## 📁 Archivos creados/modificados

```
.github/
  └── workflows/
      └── ci.yml           # Workflow de GitHub Actions

tests/
  └── app.test.js          # Tests unitarios con BDD

.gitignore                 # Archivos a ignorar
eslint.config.mjs          # Configuración de ESLint (actualizada)
package.json               # Scripts agregados
```

---

## 🐛 Solución de problemas

### El pipeline falla en Snyk
→ Verifica que el token `SNYK_TOKEN` esté configurado correctamente en GitHub Secrets

### Los tests fallan localmente
```bash
npm install
npm test
```

### ESLint reporta errores
```bash
npm run lint:fix
```

---

## ✅ ¿Qué cumple este proyecto?

| Requisito | Estado | Herramienta |
|-----------|--------|-------------|
| **Linting** | ✅ | ESLint |
| **SAST** | ✅ | Semgrep + Snyk |
| **Unit Tests** | ✅ | Jest |
| **BDD** | ✅ | GIVEN-WHEN-THEN |
| **CI/CD** | ✅ | GitHub Actions |
| **Pipeline automático** | ✅ | Se ejecuta en push/PR |
| **Bloqueo por errores** | ✅ | Si lint o tests fallan, no continúa |

---

## 👨‍💻 Autor

**Universidad Nacional de Costa Rica**  
Proyecto de Seguridad Informática

## 📄 Licencia

MIT
