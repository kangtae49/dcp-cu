import sys
import time

def main():
    print(sys.argv)
    for i in range(10):
        print("Hello World!", flush=True)
        time.sleep(1)

if __name__ == "__main__":
    main()
