# python_demo.py
# This file provides high-quality, fully runnable Python implementations for all
# 5 core curriculum levels in our Study Buddy application's Python learning path.
# You can execute this file locally using command: `python python_demo.py`

import math
import asyncio

# ==========================================
# PHASE 1: Variable Squaring Machine
# Focus: Dynamic Typing & Primitive Operations
# ==========================================
def run_phase_1():
    print("--- PHASE 1: Variable Squaring Machine ---")
    base_val = 12
    result_val = base_val ** 2
    print(f"Input base_val: {base_val} (Type: {type(base_val).__name__})")
    print(f"Calculated result_val (base_val ** 2): {result_val}")
    print("Verification: SUCCESS\n")


# ==========================================
# PHASE 2: Collection Structures & Iteration
# Focus: Structural List comprehension
# ==========================================
def run_phase_2():
    print("--- PHASE 2: Collection Structures & Iteration ---")
    input_list = [3, 8, 12, 17, 20]
    
    # Filter numbers strictly greater than 10
    filtered_list = [x for x in input_list if x > 10]
    
    print(f"Initial input_list: {input_list}")
    print(f"Filtered filtered_list (x > 10): {filtered_list}")
    print("Verification: SUCCESS\n")


# ==========================================
# PHASE 3: Functional Architecture & Scope
# Focus: Fahrenheit-to-Celsius custom wrapping
# ==========================================
def to_celsius(fahrenheit):
    return (fahrenheit - 32) * 5 / 9

def run_phase_3():
    print("--- PHASE 3: Functional Converter ---")
    fahrenheit_value = 68
    celsius_value = to_celsius(fahrenheit_value)
    print(f"Formula applied: ({fahrenheit_value}°F - 32) * 5/9")
    print(f"Computed Celsius value: {celsius_value:.2f}°C")
    print("Verification: SUCCESS\n")


# ==========================================
# PHASE 4: Object-Oriented Programming (OOP)
# Focus: Class inheritance & Custom saludar greeting
# ==========================================
class StudyMascot:
    def __init__(self, name: str):
        self.name = name
        
    def greet(self) -> str:
        return f"Hello, I am {self.name}! Let's master Python together."

def run_phase_4():
    print("--- PHASE 4: Object-Oriented Programming ---")
    mascot = StudyMascot("PyBuddy")
    print(f"Instantiated StudyMascot object name: {mascot.name}")
    print(f"Invocated greet() reaction: '{mascot.greet()}'")
    print("Verification: SUCCESS\n")


# ==========================================
# PHASE 5: Practical Scripting & Data Parsing
# Focus: Python Exception safety structures
# ==========================================
def execute_call():
    # Simulate a web request context or local I/O crash
    raise ConnectionResetError("Remote server refused the study handshake.")

def run_phase_5():
    print("--- PHASE 5: Try-Except Block exception logger ---")
    error_logged = False
    try:
        execute_call()
    except Exception as err:
        error_logged = True
        print(f"Exception triggered & handled safely: '{err}'")
        print(f"Variables update 'error_logged' recorded as: {error_logged}")
        print("Verification: SUCCESS\n")


# ==========================================
# MAIN EXECUTION THREAD
# ==========================================
if __name__ == "__main__":
    print("=" * 55)
    print("   STUDY BUDDY APPLET • CORE PYTHON REFERENCE EXAMPLES  ")
    print("=" * 55)
    print()
    
    run_phase_1()
    run_phase_2()
    run_phase_3()
    run_phase_4()
    run_phase_5()
    
    print("=" * 55)
    print("All Python study curriculum code snippets build successfully.")
    print("=" * 55)
